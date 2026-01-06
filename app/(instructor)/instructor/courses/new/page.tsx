'use client';

import { useState } from 'react';
import {
  Upload,
  X,
  Plus,
  Save,
  Eye,
  ImagePlus,
  Video,
  FileText,
  Settings,
  DollarSign,
  Users,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
  PlayCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

type Section = {
  id: number;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
};

type Lesson = {
  id: number;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
  isPreview: boolean;
};

export default function CreateEditCoursePage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    level: '',
    language: 'vi',
    price: '',
    discountPrice: '',
    tags: [] as string[],
    requirements: [''],
    objectives: [''],
    targetAudience: ['']
  });

  const [sections, setSections] = useState<Section[]>([
    {
      id: 1,
      title: 'Giới thiệu khóa học',
      isExpanded: true,
      lessons: [
        { id: 1, title: 'Chào mừng đến với khóa học', type: 'video', duration: '5:30', isPreview: true },
        { id: 2, title: 'Chuẩn bị môi trường', type: 'article', duration: '10 phút', isPreview: false }
      ]
    }
  ]);

  const [currentTag, setCurrentTag] = useState('');

  const tabs = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: FileText },
    { id: 'curriculum', label: 'Nội dung khóa học', icon: Video },
    { id: 'pricing', label: 'Giá & Xuất bản', icon: DollarSign },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ];

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'UI/UX Design',
    'Marketing',
    'Business',
    'Photography',
    'Music'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'preview') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'thumbnail') {
          setThumbnail(reader.result as string);
        } else {
          setPreviewVideo(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter(t => t !== tag)
    });
  };

  const addArrayItem = (field: 'requirements' | 'objectives' | 'targetAudience') => {
    setCourseData({
      ...courseData,
      [field]: [...courseData[field], '']
    });
  };

  const updateArrayItem = (field: 'requirements' | 'objectives' | 'targetAudience', index: number, value: string) => {
    const newArray = [...courseData[field]];
    newArray[index] = value;
    setCourseData({
      ...courseData,
      [field]: newArray
    });
  };

  const removeArrayItem = (field: 'requirements' | 'objectives' | 'targetAudience', index: number) => {
    setCourseData({
      ...courseData,
      [field]: courseData[field].filter((_, i) => i !== index)
    });
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now(),
      title: `Chương ${sections.length + 1}`,
      lessons: [],
      isExpanded: true
    };
    setSections([...sections, newSection]);
  };

  const toggleSection = (sectionId: number) => {
    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s
    ));
  };

  const addLesson = (sectionId: number) => {
    setSections(sections.map(s =>
      s.id === sectionId
        ? {
            ...s,
            lessons: [
              ...s.lessons,
              {
                id: Date.now(),
                title: `Bài học ${s.lessons.length + 1}`,
                type: 'video',
                duration: '0:00',
                isPreview: false
              }
            ]
          }
        : s
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Tạo khóa học mới</h1>
              <p className="mt-2 text-gray-600">Điền thông tin để tạo khóa học của bạn</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Eye className="w-5 h-5" />
                Xem trước
              </button>
              <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl">
                <Save className="w-5 h-5" />
                Lưu khóa học
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">Tiến độ hoàn thành</span>
              <span className="text-sm font-semibold text-blue-600">45%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: '45%' }}></div>
            </div>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">Thông tin cơ bản</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-gray-600">Nội dung khóa học</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Giá & Xuất bản</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-8">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-8">
                  {/* Title */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Tiêu đề khóa học *
                    </label>
                    <input
                      type="text"
                      value={courseData.title}
                      onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                      placeholder="VD: Complete Web Development Bootcamp 2024"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">Tối đa 60 ký tự</p>
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Phụ đề
                    </label>
                    <input
                      type="text"
                      value={courseData.subtitle}
                      onChange={(e) => setCourseData({ ...courseData, subtitle: e.target.value })}
                      placeholder="Mô tả ngắn gọn về khóa học"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Mô tả khóa học *
                    </label>
                    <textarea
                      value={courseData.description}
                      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                      placeholder="Giới thiệu chi tiết về khóa học, nội dung, lợi ích..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Category & Level */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-900">
                        Danh mục *
                      </label>
                      <select
                        value={courseData.category}
                        onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-900">
                        Cấp độ *
                      </label>
                      <select
                        value={courseData.level}
                        onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn cấp độ</option>
                        {levels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Ảnh thumbnail *
                    </label>
                    <div className="p-8 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500">
                      {thumbnail ? (
                        <div className="relative">
                          <img src={thumbnail} alt="Thumbnail" className="mx-auto rounded-lg max-h-64" />
                          <button
                            onClick={() => setThumbnail(null)}
                            className="absolute p-2 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <ImagePlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="mb-2 text-gray-600">Kéo thả ảnh hoặc click để upload</p>
                          <p className="text-sm text-gray-500">PNG, JPG tối đa 2MB (tỷ lệ 16:9)</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'thumbnail')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Tags (từ khóa)
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Nhập tag và nhấn Enter"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={addTag}
                        className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Thêm
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {courseData.tags.map(tag => (
                        <span
                          key={tag}
                          className="flex items-center gap-2 px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full"
                        >
                          {tag}
                          <button onClick={() => removeTag(tag)}>
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Yêu cầu đầu vào
                    </label>
                    {courseData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                          placeholder="VD: Kiến thức cơ bản về HTML/CSS"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {courseData.requirements.length > 1 && (
                          <button
                            onClick={() => removeArrayItem('requirements', index)}
                            className="p-3 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('requirements')}
                      className="flex items-center gap-2 px-4 py-2 mt-2 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm yêu cầu
                    </button>
                  </div>

                  {/* Objectives */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Bạn sẽ học được gì
                    </label>
                    {courseData.objectives.map((obj, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={obj}
                          onChange={(e) => updateArrayItem('objectives', index, e.target.value)}
                          placeholder="VD: Xây dựng website responsive với React"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {courseData.objectives.length > 1 && (
                          <button
                            onClick={() => removeArrayItem('objectives', index)}
                            className="p-3 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('objectives')}
                      className="flex items-center gap-2 px-4 py-2 mt-2 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm mục tiêu
                    </button>
                  </div>
                </div>
              )}

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Nội dung khóa học</h3>
                      <p className="mt-1 text-gray-600">Tổ chức bài học thành các chương</p>
                    </div>
                    <button
                      onClick={addSection}
                      className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                      Thêm chương mới
                    </button>
                  </div>

                  {/* Sections */}
                  <div className="space-y-4">
                    {sections.map((section, sectionIndex) => (
                      <div key={section.id} className="border border-gray-300 rounded-lg">
                        {/* Section Header */}
                        <div className="flex items-center justify-between p-4 bg-gray-50">
                          <div className="flex items-center flex-1 gap-3">
                            <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                            <span className="font-semibold text-gray-900">Chương {sectionIndex + 1}:</span>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => {
                                const newSections = [...sections];
                                newSections[sectionIndex].title = e.target.value;
                                setSections(newSections);
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => addLesson(section.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 rounded-lg hover:bg-blue-50"
                            >
                              <Plus className="w-4 h-4" />
                              Thêm bài học
                            </button>
                            <button
                              onClick={() => toggleSection(section.id)}
                              className="p-2 rounded-lg hover:bg-gray-200"
                            >
                              {section.isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                            <button className="p-2 text-red-600 rounded-lg hover:bg-red-50">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Lessons */}
                        {section.isExpanded && (
                          <div className="p-4 space-y-3">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500"
                              >
                                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                                <div className="grid items-center flex-1 grid-cols-12 gap-3">
                                  <input
                                    type="text"
                                    value={lesson.title}
                                    placeholder="Tiêu đề bài học"
                                    className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <select className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg">
                                    <option value="video">Video</option>
                                    <option value="article">Bài viết</option>
                                    <option value="quiz">Quiz</option>
                                  </select>
                                  <input
                                    type="text"
                                    value={lesson.duration}
                                    placeholder="Thời lượng"
                                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                                  />
                                  <label className="flex items-center col-span-2 gap-2 text-sm">
                                    <input type="checkbox" checked={lesson.isPreview} className="rounded" />
                                    Xem trước miễn phí
                                  </label>
                                  <button className="col-span-1 p-2 text-blue-600 rounded-lg hover:bg-blue-50">
                                    <Upload className="w-5 h-5" />
                                  </button>
                                </div>
                                <button className="p-2 text-red-600 rounded-lg hover:bg-red-50">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            ))}

                            {section.lessons.length === 0 && (
                              <div className="py-8 text-center text-gray-500">
                                <Video className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p>Chưa có bài học nào</p>
                                <button
                                  onClick={() => addLesson(section.id)}
                                  className="mt-3 text-blue-600 hover:underline"
                                >
                                  Thêm bài học đầu tiên
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Định giá khóa học</h3>
                    <p className="text-gray-600">Thiết lập giá bán và khuyến mãi cho khóa học</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-900">
                        Giá gốc (VNĐ) *
                      </label>
                      <input
                        type="number"
                        value={courseData.price}
                        onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                        placeholder="1,299,000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-900">
                        Giá khuyến mãi (VNĐ)
                      </label>
                      <input
                        type="number"
                        value={courseData.discountPrice}
                        onChange={(e) => setCourseData({ ...courseData, discountPrice: e.target.value })}
                        placeholder="999,000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Price Preview */}
                  <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <h4 className="mb-4 font-bold text-gray-900">Xem trước giá hiển thị</h4>
                    <div className="flex items-center gap-4">
                      {courseData.discountPrice && (
                        <span className="text-3xl font-bold text-blue-600">
                          {parseInt(courseData.discountPrice).toLocaleString('vi-VN')}đ
                        </span>
                      )}
                      <span className={`text-2xl ${courseData.discountPrice ? 'line-through text-gray-500' : 'font-bold text-gray-900'}`}>
                        {courseData.price ? parseInt(courseData.price).toLocaleString('vi-VN') + 'đ' : '0đ'}
                      </span>
                      {courseData.discountPrice && courseData.price && (
                        <span className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">
                          -{Math.round((1 - parseInt(courseData.discountPrice) / parseInt(courseData.price)) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Publish Options */}
                  <div>
                    <h4 className="mb-4 font-bold text-gray-900">Tùy chọn xuất bản</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                        <input type="radio" name="publish" value="draft" defaultChecked className="w-4 h-4" />
                        <div>
                          <div className="font-semibold text-gray-900">Lưu nháp</div>
                          <div className="text-sm text-gray-600">Chỉ bạn có thể xem khóa học này</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                        <input type="radio" name="publish" value="publish" className="w-4 h-4" />
                        <div>
                          <div className="font-semibold text-gray-900">Xuất bản ngay</div>
                          <div className="text-sm text-gray-600">Khóa học sẽ hiển thị công khai</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                        <input type="radio" name="publish" value="schedule" className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Lên lịch xuất bản</div>
                          <div className="mb-2 text-sm text-gray-600">Chọn thời gian xuất bản</div>
                          <input
                            type="datetime-local"
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button className="flex-1 px-6 py-4 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                      Lưu nháp
                    </button>
                    <button className="flex-1 px-6 py-4 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl">
                      Xuất bản khóa học
                    </button>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Cài đặt khóa học</h3>
                    <p className="text-gray-600">Tùy chỉnh các cài đặt nâng cao</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div>
                        <div className="font-semibold text-gray-900">Cho phép đánh giá</div>
                        <div className="text-sm text-gray-600">Học viên có thể đánh giá và review khóa học</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-12 h-6 transition-colors bg-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-600"></div>
                        <div className="absolute w-4 h-4 transition-transform bg-white rounded-full left-1 top-1 peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div>
                        <div className="font-semibold text-gray-900">Q&A</div>
                        <div className="text-sm text-gray-600">Học viên có thể đặt câu hỏi</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-12 h-6 transition-colors bg-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-600"></div>
                        <div className="absolute w-4 h-4 transition-transform bg-white rounded-full left-1 top-1 peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div>
                        <div className="font-semibold text-gray-900">Chứng chỉ hoàn thành</div>
                        <div className="text-sm text-gray-600">Cấp chứng chỉ khi hoàn thành khóa học</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-12 h-6 transition-colors bg-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-600"></div>
                        <div className="absolute w-4 h-4 transition-transform bg-white rounded-full left-1 top-1 peer-checked:translate-x-6"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div>
                        <div className="font-semibold text-gray-900">Truy cập trọn đời</div>
                        <div className="text-sm text-gray-600">Học viên có thể truy cập mãi mãi</div>
                      </div>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-12 h-6 transition-colors bg-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-600"></div>
                        <div className="absolute w-4 h-4 transition-transform bg-white rounded-full left-1 top-1 peer-checked:translate-x-6"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}