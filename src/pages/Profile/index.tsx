import { Button, message, Progress, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  Loader2, Lock, Mail,
  Save, ShieldCheck, User,
  Zap
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChangePasswordForm, IPaymentTransaction, ISubscription } from '../../entities/Profile';
import {
  ChangePassword,
  GetMySubscription, GetMyTransactions,
  GetUserProfile, UpdateProfile, uploadAvatarToFirebase
} from '../../features/Profile';
import api from '../../shared/api/axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'billing'>('info');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [passData, setPassData] = useState<ChangePasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [packageNames, setPackageNames] = useState<Record<string, string>>({});
  const [transactions, setTransactions] = useState<IPaymentTransaction[]>([]);
  const [billingLoading, setBillingLoading] = useState(false);

  const userId = localStorage.getItem('UserId');

  const isInfoValid = fullName.trim().length > 0;

  const isPasswordValid =
    passData.currentPassword.trim().length > 0 &&
    passData.newPassword.trim().length > 0 &&
    passData.confirmPassword.trim().length > 0;

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (activeTab === 'billing') {
      fetchBillingData();
    }
  }, [activeTab]);

  const fetchUserData = async () => {
    if (!userId) return;
    const userData = await GetUserProfile(userId);
    if (userData) {
      setUser(userData);
      setFullName(userData.fullName || '');
      setAvatarUrl(userData.avatarUrl || '');
    }
  };

  const fetchBillingData = async () => {
    setBillingLoading(true);
    try {
      const [subData, transData] = await Promise.all([
        GetMySubscription(),
        GetMyTransactions()
      ]);

      if (subData && subData.length > 0) {
        setSubscriptions(subData);
        // Fetch package names for all unique packageIds
        const uniquePackageIds = [...new Set(subData.filter(s => s.packageId).map(s => s.packageId!))];
        const names: Record<string, string> = {};
        await Promise.all(
          uniquePackageIds.map(async (pkgId) => {
            try {
              const response = await api.get(`packages/${pkgId}`);
              if (response.data && response.data.result) {
                names[pkgId] = response.data.result.packageName || response.data.result.name || 'Gói dịch vụ';
              }
            } catch {
              names[pkgId] = 'Gói dịch vụ';
            }
          })
        );
        setPackageNames(names);
      }
      if (transData) setTransactions(transData);
    } catch (error) {
      console.error("Error fetching billing data", error);
    } finally {
      setBillingLoading(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn file ảnh!');
      return;
    }
    setUploading(true);
    const url = await uploadAvatarToFirebase(file, userId);
    setUploading(false);
    if (url) {
      setAvatarUrl(url);
      message.success("Tải ảnh thành công! Đừng quên lưu thay đổi.");
    }
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!isInfoValid) return; // Chặn nếu chưa nhập tên

    setLoading(true);
    const success = await UpdateProfile(userId, { fullName, avatarUrl });
    if (success) {
      fetchUserData();
      localStorage.setItem("AvatarUrl", avatarUrl);
      message.success("Cập nhật thông tin thành công!");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return; // Chặn nếu chưa nhập đủ

    if (passData.newPassword !== passData.confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    const success = await ChangePassword(userId!, passData);
    if (success) {
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      message.success("Đổi mật khẩu thành công!");
    }
    setLoading(false);
  };

  const calculateDaysLeft = (sub: ISubscription) => {
    if (!sub?.endDate) return 0;
    const end = new Date(sub.endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const calculateProgress = (sub: ISubscription) => {
    if (!sub?.startDate || !sub?.endDate) return 0;
    const start = new Date(sub.startDate).getTime();
    const end = new Date(sub.endDate).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;

    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const activeSubscriptions = subscriptions.filter(s => s.isActive);

  const transactionColumns: ColumnsType<IPaymentTransaction> = [
    {
      title: 'Mã GD',
      dataIndex: 'transactionCode',
      key: 'transactionCode',
      render: (text: string, record: IPaymentTransaction) => (
        <span className="font-mono text-xs text-[#94A3B8]">
          {text || record.id?.slice(0, 8)?.toUpperCase() || 'N/A'}
        </span>
      )
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => <span className="font-bold font-inter text-[#04306E]">{val?.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      responsive: ['md'] as any,
      render: (method: string) => <span className="font-inter text-[#64748B] text-sm">{method || 'N/A'}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const s = (status || '').toUpperCase();
        const isSuccess = ['PAID', 'COMPLETED', 'SUCCESS'].includes(s);
        const isPending = ['PENDING', 'PROCESSING'].includes(s);
        const isCancelled = ['CANCELLED', 'CANCELED', 'FAILED', 'REJECTED'].includes(s);
        return (
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-inter ${isSuccess ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
            isPending ? 'bg-amber-50 text-amber-600 border border-amber-200' :
              isCancelled ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
            }`}>
            {isSuccess ? <CheckCircle2 size={12} className="mr-1" /> :
              isPending ? <Clock size={12} className="mr-1" /> :
                isCancelled ? <AlertCircle size={12} className="mr-1" /> :
                  <AlertCircle size={12} className="mr-1" />}
            {s}
          </div>
        );
      }
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paidAt',
      key: 'paidAt',
      responsive: ['md'] as any,
      render: (paidAt: string) => (
        <span className="font-inter text-[#94A3B8] text-sm">
          {paidAt ? new Date(paidAt).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }) : 'Chưa thanh toán'}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#E0F0FF] to-white pt-24 pb-12 px-2 sm:px-4 lg:px-8 font-sans">
      <div className="max-w-[1300px] mx-auto animate-in fade-in duration-700">

        {/* Dashboard Unified Container */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_40px_rgba(4,48,110,0.08)] border border-[#E2E8F0] overflow-hidden flex flex-col lg:flex-row lg:items-stretch min-h-[750px] relative">

          {/* Dashboard Left Sidebar */}
          <div className="w-full lg:w-[320px] bg-gradient-to-b from-[#F8FAFC] to-white border-b lg:border-b-0 lg:border-r border-[#E2E8F0] flex flex-col shrink-0 relative z-10">
            {/* User Info Stack */}
            <div className="p-8 pb-6 flex flex-col items-center border-b border-[#E2E8F0]/50 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3398DB]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="relative group mb-4">
                <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-white shadow-lg shadow-[#04306E]/10 bg-white relative">
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
                      <Loader2 className="animate-spin text-white" size={28} />
                    </div>
                  )}
                  <img
                    src={avatarUrl || `https://ui-avatars.com/api/?name=${fullName || 'User'}&background=3398DB&color=fff&size=256`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 p-2.5 bg-gradient-to-br from-[#04306E] to-[#3398DB] text-white rounded-xl shadow-md hover:scale-110 transition-transform"
                >
                  <Camera size={16} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="text-center w-full">
                <h1 className="text-xl font-space font-bold text-[#04306E] truncate px-2">
                  {user?.fullName || 'Người dùng'}
                </h1>
                <p className="font-inter text-[#64748B] text-sm mt-1 truncate px-2 flex items-center justify-center gap-1.5">
                  <Mail size={14} className="opacity-70" />
                  {user?.email || localStorage.getItem('Email')}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F0F7FF] text-[#3398DB] rounded-lg text-[11px] font-bold border border-[#3398DB]/20 tracking-wider">
                    <BadgeCheck size={12} className="text-[#3398DB]" /> VERIFIED
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-[#04306E] to-[#3398DB] text-white rounded-lg text-[11px] font-bold border border-[#04306E]/20 shadow-sm tracking-wider uppercase">
                    {localStorage.getItem('Role') || 'MEMBER'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="p-4 flex-1 flex flex-col gap-1.5">
              <div className="px-4 py-2 mb-1">
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest font-inter">Cài đặt tài khoản</span>
              </div>
              {[
                { id: 'info', label: 'Hồ sơ cá nhân', icon: User, desc: 'Thông tin hiển thị' },
                { id: 'password', label: 'Bảo mật', icon: ShieldCheck, desc: 'Mật khẩu & Đăng nhập' },
                { id: 'billing', label: 'Gói dịch vụ', icon: CreditCard, desc: 'Quản lý nâng cấp' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 text-left relative group overflow-hidden ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#F0F7FF] to-white shadow-sm ring-1 ring-[#3398DB]/20'
                    : 'hover:bg-white hover:shadow-[0_2px_10px_rgba(4,48,110,0.02)]'
                    }`}
                >
                  {activeTab === tab.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3398DB] rounded-r-full shadow-[0_0_10px_rgba(51,152,219,0.5)]"></div>
                  )}
                  <div className={`p-2.5 rounded-xl transition-colors duration-300 relative z-10 ${activeTab === tab.id ? 'bg-white shadow-sm border border-[#E2E8F0] text-[#3398DB]' : 'bg-[#F8FAFC] text-[#94A3B8] group-hover:text-[#3398DB]'}`}>
                    <tab.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="relative z-10 flex-1">
                    <span className={`block font-inter font-bold text-sm tracking-tight transition-colors ${activeTab === tab.id ? 'text-[#04306E]' : 'text-[#64748B] group-hover:text-[#04306E]'}`}>{tab.label}</span>
                    <span className={`block font-inter text-[11px] font-medium mt-0.5 transition-colors ${activeTab === tab.id ? 'text-[#3398DB] opacity-80' : 'text-[#94A3B8]'}`}>{tab.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Right Content Area */}
          <div className="flex-1 bg-white relative overflow-hidden flex flex-col h-full lg:h-[750px] z-0">
            {/* Background Glows for large area */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#F0F7FF] to-[#E0F0FF] rounded-full blur-[80px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3398DB]/5 rounded-full blur-[60px] opacity-50 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

            <div className="p-6 md:p-10 lg:p-14 xl:p-20 flex-1 overflow-y-auto relative z-10 w-full h-full min-h-full">

              {/* TAB 1: INFO */}
              {activeTab === 'info' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                  <div className="mb-8 border-b border-[#F1F5F9] pb-4">
                    <h3 className="text-2xl font-space font-bold text-[#04306E]">Thông tin cá nhân</h3>
                    <p className="font-inter text-[#64748B] mt-1">Quản lý tên hiển thị và ảnh đại diện của bạn.</p>
                  </div>

                  <form onSubmit={handleUpdateInfo} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-inter font-bold text-[#334155]">Họ và tên hiển thị</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#3398DB] transition-colors" size={20} />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-white/50 border border-[#E2E8F0] rounded-xl pl-12 pr-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-[#3398DB]/10 focus:border-[#3398DB] transition-all outline-none font-inter font-medium text-[#04306E] shadow-sm"
                          placeholder="Nhập họ tên của bạn"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading || uploading || !isInfoValid}
                        className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl transition-all font-inter font-bold
                          ${isInfoValid
                            ? 'bg-gradient-to-r from-[#04306E] to-[#3398DB] hover:from-[#032454] hover:to-[#2980b9] text-white shadow-lg shadow-[#3398DB]/20 hover:shadow-[#3398DB]/40 transform hover:-translate-y-0.5'
                            : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed opacity-80 border border-[#E2E8F0]'
                          }`}
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: PASSWORD */}
              {activeTab === 'password' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
                  <div className="mb-8 border-b border-[#F1F5F9] pb-4">
                    <h3 className="text-2xl font-space font-bold text-[#04306E]">Đổi mật khẩu</h3>
                    <p className="font-inter text-[#64748B] mt-1">Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản.</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-5">
                    {[
                      { key: 'currentPassword', label: 'Mật khẩu hiện tại' },
                      { key: 'newPassword', label: 'Mật khẩu mới' },
                      { key: 'confirmPassword', label: 'Xác nhận mật khẩu mới' },
                    ].map((f) => (
                      <div key={f.key} className="space-y-2">
                        <label className="text-sm font-inter font-bold text-[#334155]">{f.label}</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#3398DB] transition-colors" size={20} />
                          <input
                            type="password"
                            required
                            value={(passData as any)[f.key]}
                            onChange={(e) => setPassData({ ...passData, [f.key]: e.target.value })}
                            className="w-full bg-white/50 border border-[#E2E8F0] rounded-xl pl-12 pr-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-[#3398DB]/10 focus:border-[#3398DB] transition-all outline-none font-inter font-medium text-[#04306E] shadow-sm"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading || !isPasswordValid}
                        className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl transition-all font-inter font-bold
                          ${isPasswordValid
                            ? 'bg-gradient-to-r from-[#04306E] to-[#3398DB] hover:from-[#032454] hover:to-[#2980b9] text-white shadow-lg shadow-[#3398DB]/20 hover:shadow-[#3398DB]/40 transform hover:-translate-y-0.5'
                            : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed opacity-80 border border-[#E2E8F0]'
                          }`}
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: BILLING */}
              {activeTab === 'billing' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {billingLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="animate-spin text-[#3398DB]" size={40} />
                      <p className="font-inter text-[#64748B] font-medium">Đang tải thông tin gói...</p>
                    </div>
                  ) : (
                    <div className="grid gap-8">
                      {/* Subscription Section */}
                      <div>
                        <h3 className="text-2xl font-space font-bold text-[#04306E] mb-5 flex items-center gap-2">
                          <Crown className="text-[#F59E0B] fill-[#F59E0B]" size={24} />
                          Gói đăng ký của bạn
                        </h3>

                        {activeSubscriptions.length > 0 ? (
                          /* Active Subscription Cards */
                          <div className="grid gap-6">
                            {activeSubscriptions.map((sub, index) => (
                              <div key={sub.id || index} className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md border border-[#3398DB]/30 shadow-lg p-8 transition-all hover:scale-[1.01]">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#3398DB]/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#04306E]/5 rounded-full blur-3xl pointer-events-none" />

                                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                                  <div>
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="p-2 bg-[#F0F7FF] rounded-lg border border-[#3398DB]/20 shadow-sm">
                                        <Zap size={20} className="text-[#EAB308]" />
                                      </div>
                                      <span className="text-[#3398DB] font-bold font-inter tracking-wide uppercase text-sm">Gói hiện tại</span>
                                    </div>
                                    <h2 className="text-4xl font-space font-extrabold text-[#04306E] tracking-tight mb-4">
                                      {(sub.packageId && packageNames[sub.packageId]) || 'Premium Plan'}
                                    </h2>
                                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold font-inter ${calculateDaysLeft(sub) > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                                      {calculateDaysLeft(sub) > 0 && (
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                      )}
                                      {calculateDaysLeft(sub) > 0 ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ HẾT HẠN'}
                                    </div>
                                  </div>

                                  <div className="bg-[#F8FAFC]/80 backdrop-blur-md rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                                    <div className="flex justify-between text-sm mb-2 font-inter text-[#64748B] font-medium">
                                      <span>Thời hạn sử dụng</span>
                                      <span className="text-[#04306E] font-bold">{calculateDaysLeft(sub)} ngày còn lại</span>
                                    </div>
                                    <Progress
                                      percent={calculateProgress(sub)}
                                      showInfo={false}
                                      strokeColor={{ '0%': '#3398DB', '100%': '#04306E' }}
                                      trailColor="#E2E8F0"
                                      className="mb-4"
                                    />
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                      <div>
                                        <p className="font-inter text-xs text-[#94A3B8] font-semibold mb-1 uppercase tracking-wide">Ngày bắt đầu</p>
                                        <p className="font-inter font-bold text-[#334155] flex items-center gap-1.5">
                                          <CalendarDays size={14} className="text-[#3398DB]" />
                                          {sub.startDate ? new Date(sub.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-inter text-xs text-[#94A3B8] font-semibold mb-1 uppercase tracking-wide">Ngày hết hạn</p>
                                        <p className="font-inter font-bold text-[#334155] flex items-center gap-1.5">
                                          <CalendarDays size={14} className="text-[#F43F5E]" />
                                          {sub.endDate ? new Date(sub.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* No Subscription / Free Tier Card */
                          <div className="rounded-3xl border border-[#E2E8F0] p-8 bg-gradient-to-r from-[#F0F7FF] to-white shadow-[0_8px_32px_rgba(4,48,110,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#3398DB]">
                                <User size={32} />
                              </div>
                              <div>
                                <h4 className="text-xl font-space font-bold text-[#04306E]">Gói Miễn Phí</h4>
                                <p className="font-inter text-[#64748B]">Bạn đang sử dụng các tính năng cơ bản.</p>
                              </div>
                            </div>
                            <Button
                              type="primary"
                              size="large"
                              className="bg-gradient-to-r from-[#04306E] to-[#3398DB] hover:from-[#032454] hover:to-[#2980b9] h-12 px-8 rounded-xl shadow-lg shadow-[#3398DB]/20 border-none font-inter font-bold text-white flex items-center justify-center transform hover:-translate-y-0.5 transition-all"
                              onClick={() => navigate('/pricing')}
                            >
                              Nâng cấp ngay
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Transaction History */}
                      <div>
                        <h3 className="text-2xl font-space font-bold text-[#04306E] mb-5 flex items-center gap-2">
                          <Clock size={24} className="text-[#3398DB]" />
                          Lịch sử giao dịch
                        </h3>
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
                          <Table
                            dataSource={transactions}
                            columns={transactionColumns}
                            rowKey="id"
                            pagination={{
                              pageSize: 5,
                              style: { paddingRight: 24 }
                            }}
                            className="[&_.ant-table-thead_th]:!bg-[#F8FAFC] [&_.ant-table-thead_th]:!text-[#64748B] [&_.ant-table-thead_th]:!font-inter [&_.ant-table-thead_th]:!font-bold [&_.ant-table-thead_th]:!text-sm [&_.ant-table-tbody_td]:!font-inter [&_.ant-table-tbody_td]:!text-[#334155] [&_.ant-table-tbody_td]:!border-[#F1F5F9]"
                            locale={{
                              emptyText: (
                                <div className="py-12 flex flex-col items-center text-[#94A3B8]">
                                  <CreditCard size={48} strokeWidth={1} className="mb-4 text-[#CBD5E1]" />
                                  <p className="font-inter font-medium text-sm">Chưa có giao dịch nào được ghi nhận</p>
                                </div>
                              )
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;