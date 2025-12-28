'use client';

import {
  useEffect,
  useRef,
  useState,
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
  TrendingUp
} from 'lucide-react';

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
  } | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const mapUserToFormData = (nextUser: typeof user) => ({
    name: [nextUser?.first_name, nextUser?.last_name]
      .filter(Boolean)
      .join(' ')
      .trim(),
    email: nextUser?.email ?? '',
    location: nextUser?.location ?? '',
    bio: nextUser?.description ?? '',
  });

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
          throw new Error(data?.message || 'Unable to load profile.');
        }
        const json = await res.json();
        const nextUser = json?.user ?? null;
        if (!isActive) return;
        setUser(nextUser);
        setFormData(mapUserToFormData(nextUser));
      } catch (error) {
        console.error('Fetch profile error:', error);
        if (isActive) {
          setUser(null);
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

  const headerName =
    formData.name || (isLoadingUser ? 'Loading...' : 'Student User');
  const bioText =
    formData.bio || (isLoadingUser ? 'Loading profile...' : 'No bio yet.');
  const emailText =
    formData.email || (isLoadingUser ? 'Loading...' : 'Not provided');
  const locationText =
    formData.location || (isLoadingUser ? 'Loading...' : 'Not provided');
  const userInitial = (headerName || 'S').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-5xl mx-auto">
          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          {isLoadingUser && !errorMessage && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Loading profile...
            </div>
          )}
          {/* Profile Header */}
          <div className="mb-8 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
            {/* Cover Photo */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
              {displayCoverUrl ? (
                <img
                  src={displayCoverUrl}
                  alt="Cover photo"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
              )}
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isLoadingUser || isUploadingCover}
                className="absolute flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors rounded-lg bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white disabled:opacity-70 disabled:cursor-not-allowed"
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
            <div className="px-8 pb-8">
              <div className="flex flex-col items-start gap-6 mb-6 -mt-16 md:flex-row md:items-end">
                {/* Avatar */}
                <div className="relative">
                  {displayAvatarUrl ? (
                    <img
                      src={displayAvatarUrl}
                      alt={headerName}
                      className="w-32 h-32 object-cover border-4 border-white rounded-full shadow-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-32 h-32 text-4xl font-bold text-white border-4 border-white rounded-full shadow-lg bg-gradient-to-br from-blue-600 to-purple-600">
                      {userInitial}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isLoadingUser || isUploadingAvatar}
                    className="absolute flex items-center justify-center w-8 h-8 transition-colors bg-white rounded-full shadow-lg bottom-2 right-2 hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
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
                <div className="flex-1 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {headerName}
                      </h1>
                      <p className="mt-1 text-gray-600">Học viên</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setErrorMessage(null);
                        }}
                        disabled={isLoadingUser || isSaving}
                        className="flex items-center gap-2 px-6 py-2 font-semibold text-gray-700 transition-all border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit2 className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{bioText}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const colors = {
                    blue: 'bg-blue-100 text-blue-600',
                    green: 'bg-green-100 text-green-600',
                    purple: 'bg-purple-100 text-purple-600',
                    orange: 'bg-orange-100 text-orange-600',
                  };

                  return (
                    <div key={index} className="p-4 text-center rounded-lg bg-gray-50">
                      <div className={`w-10 h-10 ${colors[stat.color as keyof typeof colors]} rounded-lg flex items-center justify-center mx-auto mb-2`}>
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
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Profile Details */}
            <div className="space-y-8 lg:col-span-2">
              {/* Personal Information */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Thông tin cá nhân
                  </h2>
                  {isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{bioText}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Certificates */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Chứng chỉ ({certificates.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="overflow-hidden transition-all border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg group"
                    >
                      <div className="relative h-32 bg-gradient-to-br from-blue-600 to-purple-600">
                        <img
                          src={cert.thumbnail}
                          alt={cert.title}
                          className="object-cover w-full h-full transition-opacity opacity-20 group-hover:opacity-30"
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
            <div className="space-y-8">
              {/* Account Settings */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Cài đặt tài khoản
                </h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
                    Đổi mật khẩu
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
                    Cài đặt thông báo
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
                    Quyền riêng tư
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-left text-red-600 transition-colors rounded-lg hover:bg-red-50">
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCropOpen && cropImageSrc && activeCropConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
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
                  className="relative overflow-hidden rounded-xl bg-gray-100 touch-none select-none cursor-grab"
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
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Lưu ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
