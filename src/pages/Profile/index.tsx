import { message } from 'antd';
import { Camera, Loader2, Lock, Mail, Save, ShieldCheck, User, ChevronRight, BadgeCheck } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { ChangePasswordForm } from '../../entities/Profile';
import { ChangePassword, GetUserProfile, UpdateProfile, uploadAvatarToFirebase } from '../../features/Profile';

const ProfilePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
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

  const userId = localStorage.getItem('UserId');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!userId) return;
    const userData = await GetUserProfile(userId);
    if (userData) {
      setUser(userData);
      setFullName(userData.fullName || '');
      setAvatarUrl(userData.avatarUrl || '');
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

  return (
    <div className="min-h-screen bg-[#f1f5f9] pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        
        {/* Profile Header Card */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-white p-8">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-indigo-50 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/40 backdrop-blur-sm z-20">
                    <Loader2 className="animate-spin text-white" size={32} />
                  </div>
                )}
                <img 
                  src={avatarUrl || `https://ui-avatars.com/api/?name=${fullName || 'User'}&background=6366f1&color=fff`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={handleAvatarClick}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 hover:rotate-12 transition-all active:scale-95"
              >
                <Camera size={20} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {user?.fullName || 'Người dùng'}
                </h1>
                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  <BadgeCheck size={14} /> Verified
                </span>
              </div>
              <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 text-lg">
                <Mail size={18} className="text-indigo-400" />
                {user?.email || localStorage.getItem('Email')}
              </p>
              <div className="flex gap-2 pt-2 justify-center md:justify-start">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold border border-indigo-100 shadow-sm">
                  {localStorage.getItem('Role') || 'THÀNH VIÊN'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 space-y-3 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            {[
              { id: 'info', label: 'Thông tin cá nhân', icon: User },
              { id: 'password', label: 'Bảo mật & Mật khẩu', icon: ShieldCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 group ${
                  activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-2' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-indigo-500'} />
                  <span className="font-semibold">{tab.label}</span>
                </div>
                <ChevronRight size={18} className={`transition-transform ${activeTab === tab.id ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
              {activeTab === 'info' ? (
                <div className="animate-in slide-in-from-right-4 duration-500">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900">Cập nhật hồ sơ</h3>
                    <p className="text-gray-500 text-sm mt-1">Thông tin này sẽ được hiển thị công khai trên hệ thống.</p>
                  </div>
                  
                  <form onSubmit={handleUpdateInfo} className="space-y-6">
                    <div className="group space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Họ và tên</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-gray-700 font-medium"
                          placeholder="Ví dụ: Nguyễn Văn A"
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all disabled:opacity-50 font-bold"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Lưu thông tin mới
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="animate-in slide-in-from-right-4 duration-500">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900">Thay đổi mật khẩu</h3>
                    <p className="text-gray-500 text-sm mt-1">Đảm bảo mật khẩu của bạn có ít nhất 6 ký tự để bảo mật.</p>
                  </div>
                  
                  <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                    {[
                      { key: 'currentPassword', label: 'Mật khẩu hiện tại' },
                      { key: 'newPassword', label: 'Mật khẩu mới' },
                      { key: 'confirmPassword', label: 'Xác nhận mật khẩu' },
                    ].map((f) => (
                      <div key={f.key} className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">{f.label}</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="password"
                            required
                            value={(passData as any)[f.key]}
                            onChange={(e) => setPassData({...passData, [f.key]: e.target.value})}
                            className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-green-500 transition-all outline-none"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-2xl hover:bg-green-700 hover:shadow-xl hover:shadow-green-200 transition-all disabled:opacity-50 font-bold"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </form>
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