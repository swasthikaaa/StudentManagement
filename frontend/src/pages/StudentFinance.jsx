import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api'; // Using axios instance
import { CheckCircle, AlertCircle, CreditCard, Clock, Calendar, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import AuthContext from '../context/AuthContext';


// IMPORTANT: Replace this with your actual Publishable Key from Stripe Dashboard
// The key provided by the user (sk_) is Secret and cannot be used here.
// IMPORTANT: Replace the key in frontend/.env with your actual Publishable Key (pk_test_...)
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx';
console.log("Stripe Key Loaded:", stripeKey?.substring(0, 10) + "...");
const stripePromise = loadStripe(stripeKey);

const CheckoutForm = ({ amount, description, paymentDetails, onSuccess }) => {
    const { user } = useContext(AuthContext);
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) return;

        try {
            // 1. Create PaymentIntent on Backend
            const { data } = await api.post('/payments/create-payment-intent', {
                amount: amount,
                currency: 'lkr'
            });

            const clientSecret = data.clientSecret;

            // 2. Confirm Card Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user?.name || 'Student',
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
                toast.error(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // Record payment in database
                    try {
                        await api.post('/payments/record', {
                            amount: amount,
                            description: description,
                            stripePaymentIntentId: result.paymentIntent.id,
                            course: paymentDetails?.course || '',
                            rollNumber: paymentDetails?.rollNumber || '',
                            semester: paymentDetails?.semester || ''
                        });
                        onSuccess();
                    } catch (err) {
                        console.error("Failed to save payment record:", err);
                        toast.error("Payment succeeded but failed to save record. Please contact support.");
                    }
                    setProcessing(false);
                }
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            setProcessing(false);
            toast.error('Payment failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border rounded-lg bg-slate-50">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>
            {error && <div className="text-red-600 text-sm flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="btn-primary w-full flex justify-center items-center gap-2"
            >
                {processing ? 'Processing...' : `Pay LKR ${amount.toLocaleString()}`}
            </button>
        </form>
    );
};

const StudentFinance = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('pay');

    const [history, setHistory] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        course: '',
        rollNumber: '',
        semester: ''
    });

    useEffect(() => {
        fetchHistory();
        if (user) {
            setPaymentDetails({
                course: user.course || '',
                rollNumber: user.studentId || '',
                semester: user.semester || 'Semester 1'
            });
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/payments/history');
            setHistory(data);
        } catch (error) {
            console.error("Failed to load history");
        }
    };

    const handleSuccess = () => {
        setPaymentSuccess(true);
        toast.success('Payment Successful!');
        fetchHistory();
        // Keep success message visible longer or let user dismiss
    };

    const downloadReceipt = () => {
        if (!selectedPlan) return;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(30, 41, 59);
        doc.text("Payment Receipt", 105, 20, null, null, "center");

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Receipt ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 105, 30, null, null, "center");
        doc.text(`Date: ${new Date().toLocaleString()}`, 105, 35, null, null, "center");

        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Description", 20, 60);
        doc.text("Amount", 190, 60, null, null, "right");

        doc.setFont("helvetica", "bold");
        doc.text(selectedPlan.name, 20, 70);
        doc.text(`LKR ${selectedPlan.amount.toLocaleString()}`, 190, 70, null, null, "right");

        doc.line(20, 80, 190, 80);

        doc.setFontSize(14);
        doc.text("Total Paid", 20, 95);
        doc.text(`LKR ${selectedPlan.amount.toLocaleString()}`, 190, 95, null, null, "right");

        doc.save("payment_receipt.pdf");
        toast.success("Receipt Downloaded");
    };

    const plans = [
        { id: 'monthly', name: 'Monthly Fee', amount: 5000, desc: 'Pay for the current month' },
        { id: 'semester', name: 'Semester Fee', amount: 25000, desc: 'Pay for the full semester (6 months)' },
        { id: 'yearly', name: 'Yearly Fee', amount: 48000, desc: 'Pay for the full academic year (Discounted)' },
    ];

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-text-main">Student Finances</h1>
                    <p className="text-text-muted text-xs md:text-sm mt-1">Manage payments and view history</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('pay')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pay' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                    >
                        Make Payment
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                    >
                        History
                    </button>
                </div>
            </div>

            {activeTab === 'pay' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Plans Selection */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-text-main mb-4">Select Payment Type</h2>
                        <div className="space-y-4 mb-6">
                            {plans.map(plan => (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`card p-6 cursor-pointer border-2 transition-all ${selectedPlan?.id === plan.id ? 'border-primary bg-blue-50/50' : 'border-transparent hover:border-slate-200'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedPlan?.id === plan.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-main">{plan.name}</h3>
                                                <p className="text-xs text-text-muted">{plan.desc}</p>
                                            </div>
                                        </div>
                                        <span className="text-lg font-bold text-primary">LKR {plan.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="card p-6 space-y-4 bg-slate-50">
                            <h3 className="font-bold text-text-main text-sm">Billing Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-muted uppercase">Course</label>
                                    <input
                                        type="text"
                                        className="form-input text-sm py-2"
                                        value={paymentDetails.course}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, course: e.target.value })}
                                        placeholder="Course Name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-text-muted uppercase">Roll Number</label>
                                    <input
                                        type="text"
                                        className="form-input text-sm py-2"
                                        value={paymentDetails.rollNumber}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, rollNumber: e.target.value })}
                                        placeholder="ID Number"
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-bold text-text-muted uppercase">Semester</label>
                                    <select
                                        className="form-input text-sm py-2"
                                        value={paymentDetails.semester}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, semester: e.target.value })}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                            <option key={num} value={`Semester ${num}`}>Semester {num}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-text-main mb-4">Payment Details</h2>
                        {paymentSuccess ? (
                            <div className="card p-8 flex flex-col items-center justify-center text-center space-y-4 bg-green-50 border-green-100">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-green-700">Payment Successful!</h3>
                                <p className="text-green-600">Your transaction has been completed.</p>
                                <button onClick={downloadReceipt} className="btn-secondary text-sm mt-4">
                                    <Download size={16} /> Download Receipt
                                </button>
                                <button onClick={() => { setPaymentSuccess(false); setSelectedPlan(null); setActiveTab('history'); }} className="text-sm text-text-muted hover:underline mt-2">
                                    Make another payment
                                </button>
                            </div>
                        ) : (
                            <div className="card p-6">
                                {selectedPlan ? (
                                    <>
                                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                                            <span className="text-sm text-text-muted">Total Amount</span>
                                            <span className="text-2xl font-bold text-text-main">LKR {selectedPlan.amount.toLocaleString()}</span>
                                        </div>
                                        <Elements stripe={stripePromise}>
                                            <CheckoutForm
                                                amount={selectedPlan.amount}
                                                description={selectedPlan.name}
                                                paymentDetails={paymentDetails}
                                                onSuccess={handleSuccess}
                                            />
                                        </Elements>
                                    </>
                                ) : (
                                    <div className="text-center py-12 text-text-muted">
                                        <CreditCard size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>Please select a payment plan to proceed</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(item => (
                                    <tr key={item.id}>
                                        <td className="font-medium">{item.date}</td>
                                        <td>{item.description}</td>
                                        <td>LKR {item.amount.toLocaleString()}</td>
                                        <td>
                                            <span className="badge badge-success flex w-fit items-center gap-1">
                                                <CheckCircle size={12} /> {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFinance;
