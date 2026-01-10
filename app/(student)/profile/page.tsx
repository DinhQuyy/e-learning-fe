'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type PointerEvent
} from 'react';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit2,
  Camera,
  Save,
  X,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Bell,
  Lock,
  Shield,
  Trash2
} from 'lucide-react';

type NotificationSettings = {
  email: boolean;
  push: boolean;
  courseUpdates: boolean;
  marketing: boolean;
};

type PrivacySettings = {
  profileVisibility: 'public' | 'students' | 'private';
  showEmail: boolean;
  showLocation: boolean;
  showCertificates: boolean;
};

type AppSettings = {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
};

type SettingsPanel = 'password' | 'notifications' | 'privacy' | 'delete';

const defaultAppSettings: AppSettings = {
  notifications: {
    email: true,
    push: true,
    courseUpdates: true,
    marketing: false,
  },
  privacy: {
    profileVisibility: 'students',
    showEmail: false,
    showLocation: true,
    showCertificates: true,
  },
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    bio: '',
  });
  const [user, setUser] = useState<{
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    avatar?: string | null;
    cover?: string | null;
    location?: string | null;
    description?: string | null;
    display_name?: string | null;
    name?: string | null;
    preferences?: {
      app_settings?: Partial<AppSettings>;
    } | null;
  } | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeSettingsPanel, setActiveSettingsPanel] =
    useState<SettingsPanel | null>(null);
  const [appSettings, setAppSettings] =
    useState<AppSettings>(defaultAppSettings);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [deleteForm, setDeleteForm] = useState({
    confirmText: '',
    password: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const avatarObjectUrlRef = useRef<string | null>(null);
  const coverObjectUrlRef = useRef<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropMode, setCropMode] = useState<'avatar' | 'cover' | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropScale, setCropScale] = useState(1);
  const [minCropScale, setMinCropScale] = useState(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropImageNatural, setCropImageNatural] = useState({
    width: 0,
    height: 0,
  });
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const cropContainerRef = useRef<HTMLDivElement | null>(null);
  const cropObjectUrlRef = useRef<string | null>(null);
  const cropPositionRef = useRef({ x: 0, y: 0 });
  const dragStateRef = useRef({ isDragging: false, offsetX: 0, offsetY: 0 });

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
  const avatarUrl =
    user?.avatar && directusUrl ? `${directusUrl}/assets/${user.avatar}` : '';
  const coverUrl =
    user?.cover && directusUrl ? `${directusUrl}/assets/${user.cover}` : '';
  const displayAvatarUrl = avatarPreview ?? avatarUrl;
  const displayCoverUrl = coverPreview ?? coverUrl;

  const resolveDisplayName = (nextUser: typeof user) => {
    const combined = [nextUser?.first_name, nextUser?.last_name]
      .filter(Boolean)
      .join(' ')
      .trim();
    if (combined) return combined;

    const fallback = nextUser?.display_name ?? nextUser?.name;
    if (fallback) return String(fallback).trim();

    const email = nextUser?.email ?? '';
    if (!email) return '';
    return email.split('@')[0] || email;
  };

  const mapUserToFormData = (nextUser: typeof user) => ({
    name: resolveDisplayName(nextUser),
    email: nextUser?.email ?? '',
    location: nextUser?.location ?? '',
    bio: nextUser?.description ?? '',
  });

  const mapUserToAppSettings = (nextUser: typeof user): AppSettings => {
    const preferences =
      (nextUser?.preferences && typeof nextUser.preferences === 'object'
        ? nextUser.preferences
        : null) ?? {};
    const storedSettings =
      (preferences.app_settings &&
      typeof preferences.app_settings === 'object'
        ? preferences.app_settings
        : null) ?? {};

    return {
      notifications: {
        ...defaultAppSettings.notifications,
        ...(storedSettings.notifications ?? {}),
      },
      privacy: {
        ...defaultAppSettings.privacy,
        ...(storedSettings.privacy ?? {}),
      },
    };
  };

  const cropConfigs = {
    avatar: {
      title: 'Cắt ảnh đại diện',
      outputSize: { width: 1080, height: 1080 },
      frameStyle: { width: 'min(70vw, 320px)', aspectRatio: '1 / 1' },
      zoomFactor: 3,
      tips: [
        'Kích thước khuyến nghị: 1080 x 1080 px',
        'Tỷ lệ: 1:1 (vuông)',
        'Hiển thị thực tế: hình tròn',
        'Nên để mặt/chủ thể ở giữa, chừa viền an toàn.',
      ],
    },
    cover: {
      title: 'Cắt ảnh bìa',
      outputSize: { width: 1640, height: 624 },
      frameStyle: { width: 'min(90vw, 520px)', aspectRatio: '820 / 312' },
      zoomFactor: 2.5,
      tips: [
        'Kích thước chuẩn: 820 x 312 px',
        'Kích thước nét cao: 1640 x 624 px',
        'Tỷ lệ: ~2.63:1',
        'Nội dung quan trọng nên đặt giữa, tránh sát mép.',
      ],
    },
  } as const;

  const activeCropConfig = cropMode ? cropConfigs[cropMode] : null;

  const updatePreview = (field: 'avatar' | 'cover', previewUrl: string) => {
    if (field === 'avatar') {
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
      }
      avatarObjectUrlRef.current = previewUrl;
      setAvatarPreview(previewUrl);
      return;
    }

    if (coverObjectUrlRef.current) {
      URL.revokeObjectURL(coverObjectUrlRef.current);
    }
    coverObjectUrlRef.current = previewUrl;
    setCoverPreview(previewUrl);
  };

  const clearPreview = (field: 'avatar' | 'cover') => {
    if (field === 'avatar') {
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
        avatarObjectUrlRef.current = null;
      }
      setAvatarPreview(null);
      return;
    }

    if (coverObjectUrlRef.current) {
      URL.revokeObjectURL(coverObjectUrlRef.current);
      coverObjectUrlRef.current = null;
    }
    setCoverPreview(null);
  };

  useEffect(() => {
    cropPositionRef.current = cropPosition;
  }, [cropPosition]);

  const uploadProfileImage = async (file: File, field: 'avatar' | 'cover') => {
    const body = new FormData();
    body.append('file', file);

    const res = await fetch(`/api/auth/me/media?field=${field}`, {
      method: 'POST',
      body,
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || 'Upload failed.');
    }

    return data?.user ?? null;
  };

  const getOutputType = (type: string) => {
    if (type === 'image/png' || type === 'image/webp') {
      return type;
    }
    return 'image/jpeg';
  };

  const getOutputExtension = (type: string) => {
    if (type === 'image/png') return 'png';
    if (type === 'image/webp') return 'webp';
    return 'jpg';
  };

  const openCropper = (file: File, field: 'avatar' | 'cover') => {
    if (cropObjectUrlRef.current) {
      URL.revokeObjectURL(cropObjectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    cropObjectUrlRef.current = objectUrl;
    setCropFile(file);
    setCropMode(field);
    setCropImageSrc(objectUrl);
    setIsCropOpen(true);
    setCropImageNatural({ width: 0, height: 0 });
    setCropScale(1);
    setMinCropScale(1);
    setCropPosition({ x: 0, y: 0 });
  };

  const closeCropper = () => {
    setIsCropOpen(false);
    setCropMode(null);
    setCropImageSrc(null);
    setCropFile(null);
    setCropScale(1);
    setMinCropScale(1);
    setCropPosition({ x: 0, y: 0 });
    setCropImageNatural({ width: 0, height: 0 });
    dragStateRef.current.isDragging = false;
    if (cropObjectUrlRef.current) {
      URL.revokeObjectURL(cropObjectUrlRef.current);
      cropObjectUrlRef.current = null;
    }
  };

  const clampCropPosition = (
    position: { x: number; y: number },
    scale: number
  ) => {
    const frame = cropContainerRef.current;
    if (!frame || !cropImageNatural.width || !cropImageNatural.height) {
      return position;
    }
    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;
    const scaledWidth = cropImageNatural.width * scale;
    const scaledHeight = cropImageNatural.height * scale;
    const minX = Math.min(0, frameWidth - scaledWidth);
    const minY = Math.min(0, frameHeight - scaledHeight);
    return {
      x: Math.max(minX, Math.min(position.x, 0)),
      y: Math.max(minY, Math.min(position.y, 0)),
    };
  };

  const handleCropPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragStateRef.current.isDragging = true;
    dragStateRef.current.offsetX = event.clientX - cropPositionRef.current.x;
    dragStateRef.current.offsetY = event.clientY - cropPositionRef.current.y;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCropPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDragging) return;
    const nextPosition = {
      x: event.clientX - dragStateRef.current.offsetX,
      y: event.clientY - dragStateRef.current.offsetY,
    };
    setCropPosition(clampCropPosition(nextPosition, cropScale));
  };

  const handleCropPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragStateRef.current.isDragging = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleZoomChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextScale = Number(event.target.value);
    setCropScale(nextScale);
    setCropPosition((prev) => clampCropPosition(prev, nextScale));
  };

  const handleCropImageLoad = (event: { currentTarget: HTMLImageElement }) => {
    setCropImageNatural({
      width: event.currentTarget.naturalWidth,
      height: event.currentTarget.naturalHeight,
    });
  };

  const handleCropConfirm = async () => {
    if (!cropMode || !cropFile || !activeCropConfig) return;
    const frame = cropContainerRef.current;
    const image = cropImageRef.current;
    if (!frame || !image || !cropImageNatural.width || !cropImageNatural.height) {
      return;
    }
    setErrorMessage(null);

    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;
    const scale = cropScale;
    const position = cropPositionRef.current;
    const cropWidth = Math.min(cropImageNatural.width, frameWidth / scale);
    const cropHeight = Math.min(cropImageNatural.height, frameHeight / scale);
    const cropX = Math.min(
      Math.max(-position.x / scale, 0),
      cropImageNatural.width - cropWidth
    );
    const cropY = Math.min(
      Math.max(-position.y / scale, 0),
      cropImageNatural.height - cropHeight
    );

    const canvas = document.createElement('canvas');
    canvas.width = activeCropConfig.outputSize.width;
    canvas.height = activeCropConfig.outputSize.height;
    const context = canvas.getContext('2d');

    if (!context) {
      setErrorMessage('Không thể cắt ảnh.');
      return;
    }

    context.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const outputType = getOutputType(cropFile.type);
    const blob = await new Promise<Blob | null>((resolve) => {
      if (outputType === 'image/jpeg') {
        canvas.toBlob(resolve, outputType, 0.92);
        return;
      }
      canvas.toBlob(resolve, outputType);
    });

    if (!blob) {
      setErrorMessage('Không thể cắt ảnh.');
      return;
    }

    const outputName = `${cropMode}-${Date.now()}.${getOutputExtension(
      outputType
    )}`;
    const croppedFile = new File([blob], outputName, { type: outputType });
    const field = cropMode;

    updatePreview(field, URL.createObjectURL(croppedFile));
    closeCropper();

    if (field === 'avatar') {
      setIsUploadingAvatar(true);
    } else {
      setIsUploadingCover(true);
    }

    try {
      const nextUser = await uploadProfileImage(croppedFile, field);
      if (!nextUser) {
        throw new Error('Upload failed.');
      }
      setUser(nextUser);
      setFormData(mapUserToFormData(nextUser));
    } catch (error) {
      console.error('Upload image error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Upload failed.'
      );
    } finally {
      clearPreview(field);
      if (field === 'avatar') {
        setIsUploadingAvatar(false);
      } else {
        setIsUploadingCover(false);
      }
    }
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: 'avatar' | 'cover'
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file.');
      return;
    }

    setErrorMessage(null);
    openCropper(file, field);
  };

  useEffect(() => {
    if (
      !isCropOpen ||
      !cropMode ||
      !cropImageNatural.width ||
      !cropImageNatural.height
    ) {
      return;
    }

    const frame = cropContainerRef.current;
    if (!frame) return;

    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;
    if (!frameWidth || !frameHeight) return;

    const scale = Math.max(
      frameWidth / cropImageNatural.width,
      frameHeight / cropImageNatural.height
    );

    setMinCropScale(scale);
    setCropScale(scale);
    setCropPosition({
      x: (frameWidth - cropImageNatural.width * scale) / 2,
      y: (frameHeight - cropImageNatural.height * scale) / 2,
    });
  }, [
    isCropOpen,
    cropMode,
    cropImageNatural.width,
    cropImageNatural.height,
  ]);

  useEffect(() => {
    let isActive = true;

    const fetchUser = async () => {
      setIsLoadingUser(true);
      setErrorMessage(null);
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          if (res.status === 401) {
            if (isActive) {
              setUser(null);
              setAppSettings(defaultAppSettings);
              setErrorMessage(
                data?.message || 'Phiên đăng nhập đã hết hạn.'
              );
            }
            window.location.href = '/login';
            return;
          }
          throw new Error(data?.message || 'Unable to load profile.');
        }
        const json = await res.json();
        const nextUser = json?.user ?? null;
        if (!isActive) return;
        setUser(nextUser);
        setFormData(mapUserToFormData(nextUser));
        setAppSettings(mapUserToAppSettings(nextUser));
        const prefsRes = await fetch('/api/auth/me/preferences', {
          cache: 'no-store',
        });
        if (prefsRes.ok) {
          const prefsJson = await prefsRes.json().catch(() => null);
          if (isActive && prefsJson?.settings) {
            setAppSettings(prefsJson.settings);
          }
        }
      } catch (error) {
        console.error('Fetch profile error:', error);
        if (isActive) {
          setUser(null);
          setAppSettings(defaultAppSettings);
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to load profile.'
          );
        }
      } finally {
        if (isActive) setIsLoadingUser(false);
      }
    };

    fetchUser();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
      }
      if (coverObjectUrlRef.current) {
        URL.revokeObjectURL(coverObjectUrlRef.current);
      }
      if (cropObjectUrlRef.current) {
        URL.revokeObjectURL(cropObjectUrlRef.current);
      }
    };
  }, []);

  const stats = [
    { icon: BookOpen, label: 'Khóa học đang học', value: '4', color: 'blue' },
    { icon: Award, label: 'Chứng chỉ', value: '8', color: 'green' },
    { icon: Clock, label: 'Giờ học', value: '156', color: 'purple' },
    { icon: TrendingUp, label: 'Điểm trung bình', value: '4.5', color: 'orange' },
  ];

  const certificates = [
    {
      id: 1,
      title: 'Python Programming Complete',
      issueDate: 'Tháng 11, 2024',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      issueDate: 'Tháng 10, 2024',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    },
    {
      id: 3,
      title: 'UI/UX Design Basics',
      issueDate: 'Tháng 9, 2024',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    },
  ];

  const settingsPanels = [
    { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
    { id: 'notifications', label: 'Cài đặt thông báo', icon: Bell },
    { id: 'privacy', label: 'Quyền riêng tư', icon: Shield },
    { id: 'delete', label: 'Xóa tài khoản', icon: Trash2, tone: 'danger' },
  ] as const;

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          bio: formData.bio,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || 'Update failed.');
      }
      const nextUser = data?.user ?? null;
      setUser(nextUser);
      setFormData(mapUserToFormData(nextUser));
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Update failed.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(mapUserToFormData(user));
    setErrorMessage(null);
  };

  const handleToggleSettingsPanel = (panel: SettingsPanel) => {
    setActiveSettingsPanel((prev) => (prev === panel ? null : panel));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handlePasswordUpdate = async () => {
    if (isSavingPassword) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (passwordForm.next.length < 8) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSavingPassword(true);

    try {
      const res = await fetch('/api/auth/me/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwordForm.current,
          new_password: passwordForm.next,
          confirm_password: passwordForm.confirm,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || 'Đổi mật khẩu thất bại.');
      }
      setPasswordForm({ current: '', next: '', confirm: '' });
      setSuccessMessage(data?.message || 'Đổi mật khẩu thành công.');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Đổi mật khẩu thất bại.'
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSavePreferences = async (
    section: 'notifications' | 'privacy'
  ) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (section === 'notifications') {
      setIsSavingNotifications(true);
    } else {
      setIsSavingPrivacy(true);
    }

    const payload: Partial<AppSettings> =
      section === 'notifications'
        ? { notifications: appSettings.notifications }
        : { privacy: appSettings.privacy };

    try {
      const res = await fetch('/api/auth/me/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || 'Cập nhật cài đặt thất bại.');
      }
      if (data?.settings) {
        setAppSettings(data.settings);
      } else {
        setAppSettings((prev) => ({
          notifications: payload.notifications ?? prev.notifications,
          privacy: payload.privacy ?? prev.privacy,
        }));
      }
      setSuccessMessage('Cập nhật cài đặt thành công.');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Cập nhật cài đặt thất bại.'
      );
    } finally {
      if (section === 'notifications') {
        setIsSavingNotifications(false);
      } else {
        setIsSavingPrivacy(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (isDeletingAccount) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    const confirmPhrase = 'XOA';
    const normalizedConfirm = deleteForm.confirmText.trim().toUpperCase();

    if (normalizedConfirm !== confirmPhrase) {
      setErrorMessage(`Vui lòng nhập "${confirmPhrase}" để xác nhận.`);
      return;
    }

    if (!deleteForm.password) {
      setErrorMessage('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    setIsDeletingAccount(true);

    try {
      const res = await fetch('/api/auth/me/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: deleteForm.password,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || 'Xóa tài khoản thất bại.');
      }
      setDeleteForm({ confirmText: '', password: '' });
      setSuccessMessage(data?.message || 'Tài khoản đã được xóa.');
      window.setTimeout(() => {
        window.location.href = '/';
      }, 1200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Xóa tài khoản thất bại.'
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const resolvedDisplayName = resolveDisplayName(user);
  const headerName =
    formData.name ||
    resolvedDisplayName ||
    (isLoadingUser ? 'Loading...' : 'Student User');
  const bioText =
    formData.bio || (isLoadingUser ? 'Loading profile...' : 'No bio yet.');
  const emailText =
    formData.email || (isLoadingUser ? 'Loading...' : 'Not provided');
  const locationText =
    formData.location || (isLoadingUser ? 'Loading...' : 'Not provided');
  const userInitial = (headerName || 'S').charAt(0).toUpperCase();
  const isAccountReady = Boolean(user && !isLoadingUser);
  const pageStyle = {
    '--profile-accent': '#0ea5e9',
    '--profile-accent-soft': 'rgba(14, 165, 233, 0.12)',
    '--profile-warm': '#f59e0b',
    '--profile-ink': '#0f172a',
    '--profile-card': 'rgba(255, 255, 255, 0.86)',
    '--profile-border': 'rgba(148, 163, 184, 0.35)',
  } as CSSProperties;

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-900"
      style={pageStyle}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(14,165,233,0.25),_transparent_60%)]" />
        <div className="absolute top-16 right-[-6rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(251,191,36,0.25),_transparent_60%)]" />
        <div className="absolute bottom-[-8rem] left-[-4rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(148,163,184,0.25),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(248,250,252,0.2),rgba(248,250,252,0.95))]" />
      </div>
      <div className="relative container px-4 pb-16 pt-10 mx-auto">
        <div className="max-w-6xl mx-auto">
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-200/70 bg-red-50/80 px-5 py-4 text-sm text-red-700 shadow-sm">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-6 rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-5 py-4 text-sm text-emerald-700 shadow-sm">
              {successMessage}
            </div>
          )}
          {isLoadingUser && !errorMessage && (
            <div className="mb-6 rounded-2xl border border-blue-200/70 bg-blue-50/80 px-5 py-4 text-sm text-blue-700 shadow-sm">
              Loading profile...
            </div>
          )}
          {/* Profile Header */}
          <div
            className="mb-10 overflow-hidden rounded-3xl border border-white/70 bg-[color:var(--profile-card)] shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur motion-safe:animate-[profile-rise_0.7s_ease-out_both]"
            style={{ animationDelay: '0.05s' }}
          >
            {/* Cover Photo */}
            <div className="relative h-56 overflow-hidden bg-slate-200 sm:h-64">
              {displayCoverUrl ? (
                <img
                  src={displayCoverUrl}
                  alt="Cover photo"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-teal-500 to-amber-400" />
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-slate-900/10 to-transparent" />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isLoadingUser || isUploadingCover}
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Camera className="w-4 h-4" />
                Đổi ảnh bìa
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => handleImageChange(event, 'cover')}
                className="sr-only"
              />
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-8 sm:px-8">
              <div className="flex flex-col items-start gap-8 mb-8 -mt-10 sm:-mt-14 md:flex-row md:items-end">
                {/* Avatar */}
                <div className="relative">
                  {displayAvatarUrl ? (
                    <img
                      src={displayAvatarUrl}
                      alt={headerName}
                      className="h-32 w-32 object-cover rounded-full ring-4 ring-white shadow-xl sm:h-36 sm:w-36"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-teal-500 to-amber-400 text-4xl font-bold text-white shadow-xl ring-4 ring-white sm:h-36 sm:w-36">
                      {userInitial}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isLoadingUser || isUploadingAvatar}
                    className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Camera className="w-4 h-4 text-gray-700" />
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(event, 'avatar')}
                    className="sr-only"
                  />
                </div>

                {/* Name & Actions */}
                <div className="flex-1 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
                        Học viên
                      </p>
                      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--profile-ink)] sm:text-4xl">
                        {headerName}
                      </h1>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setErrorMessage(null);
                        }}
                        disabled={isLoadingUser || isSaving}
                        className="mt-2 flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-2 font-semibold text-slate-700 shadow-sm transition-all hover:border-[color:var(--profile-accent)] hover:text-[color:var(--profile-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Edit2 className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                  <p className="max-w-2xl text-slate-600">{bioText}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const colors = {
                    blue: 'bg-sky-100 text-sky-700',
                    green: 'bg-emerald-100 text-emerald-700',
                    purple: 'bg-amber-100 text-amber-700',
                    orange: 'bg-rose-100 text-rose-700',
                  };

                  return (
                    <div
                      key={index}
                      className="group rounded-2xl border border-white/70 bg-white/70 p-4 text-center shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div
                        className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-white/70 ${colors[stat.color as keyof typeof colors]}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column - Profile Details */}
            <div className="space-y-6 lg:col-span-8">
              {/* Personal Information */}
              <div
                className="rounded-3xl border border-white/70 bg-[color:var(--profile-card)] p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur motion-safe:animate-[profile-rise_0.7s_ease-out_both]"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Thông tin cá nhân
                  </h2>
                  {isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-full bg-[color:var(--profile-accent)] px-4 py-2 text-white shadow-sm transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        Lưu
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4" />
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        disabled={isSaving}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm focus:border-[color:var(--profile-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--profile-accent)]/30"
                      />
                    ) : (
                      <p className="text-gray-900">{headerName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-2 text-slate-500 shadow-sm cursor-not-allowed"
                      />
                    ) : (
                      <p className="text-gray-900">{emailText}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4" />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        disabled={isSaving}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm focus:border-[color:var(--profile-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--profile-accent)]/30"
                      />
                    ) : (
                      <p className="text-gray-900">{locationText}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      Giới thiệu
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        disabled={isSaving}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm focus:border-[color:var(--profile-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--profile-accent)]/30"
                      />
                    ) : (
                      <p className="text-gray-900">{bioText}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Certificates */}
              <div
                className="rounded-3xl border border-white/70 bg-[color:var(--profile-card)] p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur motion-safe:animate-[profile-rise_0.7s_ease-out_both]"
                style={{ animationDelay: '0.18s' }}
              >
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Chứng chỉ ({certificates.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="group overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-36 bg-gradient-to-br from-sky-500 via-teal-500 to-amber-400">
                        <img
                          src={cert.thumbnail}
                          alt={cert.title}
                          className="h-full w-full object-cover opacity-30 transition-opacity group-hover:opacity-40"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Award className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="mb-1 font-semibold text-gray-900 line-clamp-2">
                          {cert.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {cert.issueDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Links & Settings */}
            <div className="space-y-6 lg:col-span-4">
              {/* Account Settings */}
              <div
                className="rounded-3xl border border-white/70 bg-[color:var(--profile-card)] p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur motion-safe:animate-[profile-rise_0.7s_ease-out_both]"
                style={{ animationDelay: '0.26s' }}
              >
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Cài đặt tài khoản
                </h3>
                <div className="space-y-2">
                  {settingsPanels.map((panel) => {
                    const Icon = panel.icon;
                    const isActive = activeSettingsPanel === panel.id;
                    const isDanger = panel.tone === 'danger';

                    return (
                      <button
                        key={panel.id}
                        type="button"
                        disabled={!isAccountReady}
                        onClick={() => handleToggleSettingsPanel(panel.id)}
                        aria-expanded={isActive}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2 text-left text-sm font-semibold transition-colors ${
                          isActive
                            ? 'border-slate-200 bg-slate-50'
                            : 'border-transparent'
                        } ${
                          isDanger
                            ? 'text-red-600 hover:bg-red-50/70'
                            : 'text-slate-700 hover:bg-slate-50'
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {panel.label}
                        </span>
                        <span className="text-xs text-slate-400">
                          {isActive ? 'Ẩn' : 'Mở'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeSettingsPanel === 'password' && (
                  <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                    <p className="text-sm text-slate-600">
                      Cập nhật mật khẩu của bạn. Mật khẩu mới tối thiểu 8 ký tự.
                    </p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          value={passwordForm.current}
                          disabled={!isAccountReady || isSavingPassword}
                          onChange={(event) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              current: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm focus:border-[color:var(--profile-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--profile-accent)]/30 disabled:cursor-not-allowed disabled:bg-slate-100/80"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={passwordForm.next}
                          disabled={!isAccountReady || isSavingPassword}
                          onChange={(event) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              next: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm focus:border-[color:var(--profile-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--profile-accent)]/30 disabled:cursor-not-allowed disabled:bg-slate-100/80"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirm}
                          disabled={!isAccountReady || isSavingPassword}
                          onChange={(event) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirm: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm focus:border-[color:var(--profile-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--profile-accent)]/30 disabled:cursor-not-allowed disabled:bg-slate-100/80"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handlePasswordUpdate}
                      disabled={!isAccountReady || isSavingPassword}
                      className="mt-4 w-full rounded-full bg-[color:var(--profile-accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSavingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                  </div>
                )}

                {activeSettingsPanel === 'notifications' && (
                  <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                    <p className="text-sm text-slate-600">
                      Chọn các thông báo bạn muốn nhận từ hệ thống.
                    </p>
                    <div className="mt-4 space-y-3">
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Email thông báo
                          </p>
                          <p className="text-xs text-slate-500">
                            Nhận cập nhật qua email.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appSettings.notifications.email}
                          disabled={!isAccountReady || isSavingNotifications}
                          onChange={(event) =>
                            setAppSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                email: event.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Thông báo đẩy
                          </p>
                          <p className="text-xs text-slate-500">
                            Nhận thông báo trên trình duyệt.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appSettings.notifications.push}
                          disabled={!isAccountReady || isSavingNotifications}
                          onChange={(event) =>
                            setAppSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                push: event.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Cập nhật khóa học
                          </p>
                          <p className="text-xs text-slate-500">
                            Thông báo khi có bài học mới.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appSettings.notifications.courseUpdates}
                          disabled={!isAccountReady || isSavingNotifications}
                          onChange={(event) =>
                            setAppSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                courseUpdates: event.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Tin tức & khuyến mãi
                          </p>
                          <p className="text-xs text-slate-500">
                            Ưu đãi và thông tin nền tảng.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appSettings.notifications.marketing}
                          disabled={!isAccountReady || isSavingNotifications}
                          onChange={(event) =>
                            setAppSettings((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                marketing: event.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSavePreferences('notifications')}
                      disabled={!isAccountReady || isSavingNotifications}
                      className="mt-4 w-full rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSavingNotifications
                        ? 'Đang lưu...'
                        : 'Lưu cài đặt thông báo'}
                    </button>
                  </div>
                )}

                {activeSettingsPanel === 'privacy' && (
                  <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                    <p className="text-sm text-slate-600">
                      Kiểm soát nội dung hiển thị trên hồ sơ của bạn.
                    </p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600">
                          Hiển thị hồ sơ
                        </label>
                        <select
                          value={appSettings.privacy.profileVisibility}
                          disabled={!isAccountReady || isSavingPrivacy}
                          onChange={(event) =>
                            setAppSettings((prev) => ({
                              ...prev,
                              privacy: {
                                ...prev.privacy,
                                profileVisibility: event.target
                                  .value as PrivacySettings['profileVisibility'],
                              },
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm focus:border-[color:var(--profile-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--profile-accent)]/30 disabled:cursor-not-allowed disabled:bg-slate-100/80"
                        >
                          <option value="public">Công khai</option>
                          <option value="students">Chỉ học viên</option>
                          <option value="private">Chỉ mình tôi</option>
                        </select>
                      </div>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Hiển thị email
                          </p>
                          <p className="text-xs text-slate-500">
                            Cho phép người khác xem email.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appSettings.privacy.showEmail}
                          disabled={!isAccountReady || isSavingPrivacy}
                          onChange={(event) =>
                            setAppSettings((prev) => ({
                              ...prev,
                              privacy: {
                                ...prev.privacy,
                                showEmail: event.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Hiển thị vị trí
                          </p>
                          <p className="text-xs text-slate-500">
                            Cho phép hiển thị nơi bạn sống.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appSettings.privacy.showLocation}
                          disabled={!isAccountReady || isSavingPrivacy}
                          onChange={(event) =>
                            setAppSettings((prev) => ({
                              ...prev,
                              privacy: {
                                ...prev.privacy,
                                showLocation: event.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Hiển thị chứng chỉ
                          </p>
                          <p className="text-xs text-slate-500">
                            Chia sẻ chứng chỉ đã đạt được.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={appSettings.privacy.showCertificates}
                          disabled={!isAccountReady || isSavingPrivacy}
                          onChange={(event) =>
                            setAppSettings((prev) => ({
                              ...prev,
                              privacy: {
                                ...prev.privacy,
                                showCertificates: event.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSavePreferences('privacy')}
                      disabled={!isAccountReady || isSavingPrivacy}
                      className="mt-4 w-full rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSavingPrivacy ? 'Đang lưu...' : 'Lưu quyền riêng tư'}
                    </button>
                  </div>
                )}

                {activeSettingsPanel === 'delete' && (
                  <div className="mt-4 rounded-2xl border border-red-200/70 bg-red-50/60 p-4">
                    <p className="text-sm text-red-700">
                      Hành động này sẽ xóa vĩnh viễn tài khoản và dữ liệu của
                      bạn.
                    </p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-red-700">
                          Nhập "XOA" để xác nhận
                        </label>
                        <input
                          type="text"
                          value={deleteForm.confirmText}
                          disabled={!isAccountReady || isDeletingAccount}
                          onChange={(event) =>
                            setDeleteForm((prev) => ({
                              ...prev,
                              confirmText: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-red-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-red-50/80"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-red-700">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          value={deleteForm.password}
                          disabled={!isAccountReady || isDeletingAccount}
                          onChange={(event) =>
                            setDeleteForm((prev) => ({
                              ...prev,
                              password: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-red-200 bg-white/80 px-4 py-2 text-slate-900 shadow-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-red-50/80"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={!isAccountReady || isDeletingAccount}
                      className="mt-4 w-full rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeletingAccount ? 'Đang xóa...' : 'Xóa tài khoản'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCropOpen && cropImageSrc && activeCropConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6">
          <div className="w-full max-w-3xl rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {activeCropConfig.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Kéo ảnh để căn giữa và dùng thanh trượt để phóng to/thu nhỏ.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCropper}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <div className="flex flex-col items-center gap-4">
                <div
                  ref={cropContainerRef}
                  onPointerDown={handleCropPointerDown}
                  onPointerMove={handleCropPointerMove}
                  onPointerUp={handleCropPointerUp}
                  onPointerLeave={handleCropPointerUp}
                  className="relative cursor-grab select-none overflow-hidden rounded-2xl bg-slate-100/80 shadow-inner touch-none"
                  style={activeCropConfig.frameStyle}
                >
                  <img
                    ref={cropImageRef}
                    src={cropImageSrc}
                    alt="Crop preview"
                    onLoad={handleCropImageLoad}
                    className="absolute top-0 left-0 pointer-events-none max-w-none max-h-none"
                    style={{
                      width: `${cropImageNatural.width * cropScale}px`,
                      height: `${cropImageNatural.height * cropScale}px`,
                      transform: `translate(${cropPosition.x}px, ${cropPosition.y}px)`,
                    }}
                  />
                  {cropMode === 'avatar' ? (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="h-[85%] w-[85%] rounded-full border-2 border-white/90" />
                    </div>
                  ) : (
                    <div className="pointer-events-none absolute inset-0 border-2 border-white/90" />
                  )}
                </div>
                <div className="flex w-full items-center gap-3 text-xs text-gray-500">
                  <span>Thu nhỏ</span>
                  <input
                    type="range"
                    min={minCropScale}
                    max={minCropScale * activeCropConfig.zoomFactor}
                    step="0.01"
                    value={cropScale}
                    onChange={handleZoomChange}
                    className="flex-1"
                  />
                  <span>Phóng to</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeCropper}
                className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                className="rounded-full bg-[color:var(--profile-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
              >
                Lưu ảnh
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes profile-rise {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
