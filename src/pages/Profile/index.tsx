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
        <span className="font-mono text-xs text-gray-500">
          {text || record.id?.slice(0, 8)?.toUpperCase() || 'N/A'}
        </span>
      )
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => <span className="font-bold text-gray-900">{val?.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      responsive: ['md'] as any,
      render: (method: string) => <span className="text-gray-600 text-sm">{method || 'N/A'}</span>
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
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isSuccess ? 'bg-green-100 text-green-800' :
            isPending ? 'bg-yellow-100 text-yellow-800' :
              isCancelled ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
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
        <span className="text-gray-500 text-sm">
          {paidAt ? new Date(paidAt).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }) : 'Chưa thanh toán'}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">

        {/* Profile Header Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90"></div>
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row items-end -mt-12 gap-6">
              <div className="relative group">
                <div className="w-36 h-36 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl bg-white">
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
                      <Loader2 className="animate-spin text-white" size={32} />
                    </div>
                  )}
                  <img
                    src={avatarUrl || `https://ui-avatars.com/api/?name=${fullName || 'User'}&background=6366f1&color=fff&size=256`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="absolute bottom-2 right-2 p-2.5 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black hover:scale-105 transition-all"
                >
                  <Camera size={18} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="flex-1 text-center md:text-left mb-2">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.fullName || 'Người dùng'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 mx-auto md:mx-0 w-fit">
                    <BadgeCheck size={14} /> VERIFIED
                  </span>
                </div>
                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} />
                  {user?.email || localStorage.getItem('Email')}
                </p>
              </div>

              <div className="flex gap-3 mb-4 md:mb-2 w-full md:w-auto">
                <div className="flex-1 md:flex-none px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                  <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider">Vai trò</span>
                  <span className="font-bold text-indigo-600">{localStorage.getItem('Role') || 'MEMBER'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              {[
                { id: 'info', label: 'Hồ sơ', icon: User, desc: 'Thông tin cá nhân' },
                { id: 'password', label: 'Bảo mật', icon: ShieldCheck, desc: 'Đổi mật khẩu' },
                { id: 'billing', label: 'Gói dịch vụ', icon: CreditCard, desc: 'Lịch sử & Gói' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left mb-1 ${activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-white shadow-sm text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                    <tab.icon size={20} />
                  </div>
                  <div>
                    <span className="block font-semibold text-sm">{tab.label}</span>
                    <span className="block text-xs opacity-70 font-normal">{tab.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 min-h-[500px]">

              {/* TAB 1: INFO */}
              {activeTab === 'info' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                  <div className="mb-8 border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h3>
                    <p className="text-gray-500 mt-1">Quản lý tên hiển thị và ảnh đại diện của bạn.</p>
                  </div>

                  <form onSubmit={handleUpdateInfo} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Họ và tên hiển thị</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-900"
                          placeholder="Nhập họ tên của bạn"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading || uploading || !isInfoValid} // Disable nếu không hợp lệ
                        className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl transition-all font-semibold
                          ${isInfoValid
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5'
                            : 'bg-gray-900 text-gray-400 cursor-not-allowed opacity-80' // Nút đen khi chưa đủ
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
                  <div className="mb-8 border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h3>
                    <p className="text-gray-500 mt-1">Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản.</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-5">
                    {[
                      { key: 'currentPassword', label: 'Mật khẩu hiện tại' },
                      { key: 'newPassword', label: 'Mật khẩu mới' },
                      { key: 'confirmPassword', label: 'Xác nhận mật khẩu mới' },
                    ].map((f) => (
                      <div key={f.key} className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">{f.label}</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                          <input
                            type="password"
                            required
                            value={(passData as any)[f.key]}
                            onChange={(e) => setPassData({ ...passData, [f.key]: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading || !isPasswordValid} // Disable nếu không hợp lệ
                        className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl transition-all font-semibold
                          ${isPasswordValid
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5'
                            : 'bg-gray-900 text-gray-400 cursor-not-allowed opacity-80' // Nút đen khi chưa đủ
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
                      <Loader2 className="animate-spin text-indigo-600" size={40} />
                      <p className="text-gray-500 font-medium">Đang tải thông tin gói...</p>
                    </div>
                  ) : (
                    <div className="grid gap-8">
                      {/* Subscription Section */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                          <Crown className="text-yellow-500 fill-yellow-500" size={24} />
                          Gói đăng ký của bạn
                        </h3>

                        {activeSubscriptions.length > 0 ? (
                          /* Active Subscription Cards */
                          <div className="grid gap-6">
                            {activeSubscriptions.map((sub, index) => (
                              <div key={sub.id || index} className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-2xl p-8 transition-all hover:scale-[1.01]">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur-3xl opacity-50 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-30 pointer-events-none" />

                                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                                  <div>
                                    <div className="flex items-center gap-3 mb-2">
                                      <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
                                        <Zap size={20} className="text-yellow-400" />
                                      </div>
                                      <span className="text-indigo-200 font-medium tracking-wide uppercase text-sm">Gói hiện tại</span>
                                    </div>
                                    <h2 className="text-4xl font-extrabold tracking-tight mb-4">
                                      {(sub.packageId && packageNames[sub.packageId]) || 'Premium Plan'}
                                    </h2>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-sm font-bold">
                                      <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                      </span>
                                      {calculateDaysLeft(sub) > 0 ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ HẾT HẠN'}
                                    </div>
                                  </div>

                                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                    <div className="flex justify-between text-sm mb-2 text-gray-300">
                                      <span>Thời hạn sử dụng</span>
                                      <span className="text-white font-bold">{calculateDaysLeft(sub)} ngày còn lại</span>
                                    </div>
                                    <Progress
                                      percent={calculateProgress(sub)}
                                      showInfo={false}
                                      strokeColor={{ '0%': '#6366f1', '100%': '#a855f7' }}
                                      trailColor="rgba(255,255,255,0.1)"
                                      className="mb-4"
                                    />
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                      <div>
                                        <p className="text-xs text-gray-400 mb-1">Ngày bắt đầu</p>
                                        <p className="font-semibold flex items-center gap-1.5">
                                          <CalendarDays size={14} className="text-indigo-400" />
                                          {sub.startDate ? new Date(sub.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-400 mb-1">Ngày hết hạn</p>
                                        <p className="font-semibold flex items-center gap-1.5">
                                          <CalendarDays size={14} className="text-pink-400" />
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
                          <div className="rounded-3xl border border-gray-200 p-8 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500">
                                <User size={32} />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">Gói Miễn Phí</h4>
                                <p className="text-gray-500">Bạn đang sử dụng các tính năng cơ bản.</p>
                              </div>
                            </div>
                            <Button
                              type="primary"
                              size="large"
                              className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl shadow-lg shadow-indigo-200"
                              onClick={() => navigate('/pricing')}
                            >
                              Nâng cấp ngay
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Transaction History */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                          <Clock size={24} className="text-gray-400" />
                          Lịch sử giao dịch
                        </h3>
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                          <Table
                            dataSource={transactions}
                            columns={transactionColumns}
                            rowKey="id"
                            pagination={{
                              pageSize: 5,
                              style: { paddingRight: 24 }
                            }}
                            className="custom-table"
                            locale={{
                              emptyText: (
                                <div className="py-12 flex flex-col items-center text-gray-400">
                                  <CreditCard size={48} strokeWidth={1} className="mb-4 text-gray-300" />
                                  <p>Chưa có giao dịch nào được ghi nhận</p>
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