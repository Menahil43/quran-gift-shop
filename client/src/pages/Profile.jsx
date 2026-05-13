import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Package, MapPin, Phone, Mail, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}`,
          },
        };
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch orders');
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  if (!user) return <div className="pt-40 text-center text-navy font-bold">Please login to view profile.</div>;

  return (
    <div className="pt-32 pb-20 bg-beige-soft min-h-screen px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* User Info Card */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-beige-dark flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 bg-orange-warm rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-orange-warm/20">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="text-4xl font-serif font-bold text-navy">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-orange-warm" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-orange-warm" />
                <span>Member since {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            {user.role === 'admin' && (
              <span className="inline-block bg-navy text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Administrator
              </span>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-serif font-bold text-navy flex items-center gap-3">
            <Package className="text-orange-warm" /> Order History
          </h2>

          {loading ? (
            <div className="text-center py-12">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-beige-dark shadow-sm">
              <p className="text-gray-400 italic">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-[2.5rem] p-8 shadow-md border border-beige-dark overflow-hidden relative group">
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-400">ORDER #{order._id.slice(-6)}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {order.orderItems.map((item, i) => (
                          <p key={i} className="text-navy font-medium">{item.name} <span className="text-gray-400 text-sm">x{item.qty}</span></p>
                        ))}
                      </div>
                    </div>

                    <div className="bg-beige-soft rounded-2xl p-6 md:w-64 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Amount:</span>
                        <span className="font-bold text-navy">Rs. {order.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-orange-warm font-bold">
                        <span>Advance Paid:</span>
                        <span>Rs. {order.advancePaid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Remaining:</span>
                        <span>Rs. {order.remainingAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {order.customizationName && (
                    <div className="mt-6 pt-6 border-t border-beige-dark">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Personalization</p>
                      <p className="text-navy italic font-serif">"{order.customizationName}" on {order.customizationOptions.join(', ')}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
