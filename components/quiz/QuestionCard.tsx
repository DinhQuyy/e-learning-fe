'use client';

import { useState } from 'react';
import { QuizQuestion, StudentAnswer } from '@/types/quiz';
import { Check, X, AlertCircle } from 'lucide-react';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: Partial<StudentAnswer>) => void;
  showResult?: boolean;
  savedAnswer?: Partial<StudentAnswer>;
  disabled?: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showResult = false,
  savedAnswer,
  disabled = false,
}: QuestionCardProps) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | undefined>(
    savedAnswer?.selectedAnswerId
  );
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<string[]>(
    savedAnswer?.selectedAnswerIds || []
  );
  const [selectedBoolean, setSelectedBoolean] = useState<boolean | undefined>(
    savedAnswer?.selectedBoolean
  );
  const [textAnswer, setTextAnswer] = useState<string>(
    savedAnswer?.textAnswer || ''
  );
  const [matchedPairs, setMatchedPairs] = useState<
    { leftId: string; rightId: string }[]
  >(savedAnswer?.matchedPairs || []);

  const handleMultipleChoice = (answerId: string) => {
    if (disabled) return;
    setSelectedAnswerId(answerId);
    onAnswer({
      questionId: question.id,
      selectedAnswerId: answerId,
    });
  };

  const handleMultipleAnswer = (answerId: string) => {
    if (disabled) return;
    const newSelected = selectedAnswerIds.includes(answerId)
      ? selectedAnswerIds.filter((id) => id !== answerId)
      : [...selectedAnswerIds, answerId];
    
    setSelectedAnswerIds(newSelected);
    onAnswer({
      questionId: question.id,
      selectedAnswerIds: newSelected,
    });
  };

  const handleTrueFalse = (value: boolean) => {
    if (disabled) return;
    setSelectedBoolean(value);
    onAnswer({
      questionId: question.id,
      selectedBoolean: value,
    });
  };

  const handleTextAnswer = (text: string) => {
    if (disabled) return;
    setTextAnswer(text);
    onAnswer({
      questionId: question.id,
      textAnswer: text,
    });
  };

  const getDifficultyBadge = () => {
    const styles = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    };
    const labels = {
      easy: 'Dễ',
      medium: 'Trung bình',
      hard: 'Khó',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[question.difficulty]}`}>
        {labels[question.difficulty]}
      </span>
    );
  };

  const renderAnswerStatus = (isCorrectAnswer: boolean, isSelected: boolean) => {
    if (!showResult) return null;
    
    if (isSelected) {
      return isCorrectAnswer ? (
        <Check className="w-5 h-5 text-green-600" />
      ) : (
        <X className="w-5 h-5 text-red-600" />
      );
    }
    
    if (isCorrectAnswer) {
      return <Check className="w-5 h-5 text-green-600" />;
    }
    
    return null;
  };

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            {questionNumber}
          </span>
          <div>
            <div className="text-sm text-gray-500">
              Câu {questionNumber} / {totalQuestions}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {getDifficultyBadge()}
              <span className="text-sm font-semibold text-blue-600">
                {question.points} điểm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {question.question}
        </h3>
        {question.description && (
          <p className="text-sm text-gray-600">{question.description}</p>
        )}
      </div>

      {/* Question Image */}
      {question.imageUrl && (
        <div className="mb-6">
          <img
            src={question.imageUrl}
            alt="Question"
            className="max-w-full border border-gray-200 rounded-lg"
          />
        </div>
      )}

      {/* Answers */}
      <div className="space-y-3">
        {/* Multiple Choice */}
        {question.type === 'multiple_choice' && question.answers && (
          <>
            {question.answers.map((answer) => {
              const isSelected = selectedAnswerId === answer.id;
              const showStatus = showResult && (isSelected || answer.isCorrect);
              const borderColor = showResult
                ? isSelected && !answer.isCorrect
                  ? 'border-red-300 bg-red-50'
                  : answer.isCorrect
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200'
                : isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300';

              return (
                <button
                  key={answer.id}
                  onClick={() => handleMultipleChoice(answer.id)}
                  disabled={disabled}
                  className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${borderColor} ${
                    disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="flex-1 text-left text-gray-900">{answer.text}</span>
                  {renderAnswerStatus(answer.isCorrect, isSelected)}
                </button>
              );
            })}
          </>
        )}

        {/* Multiple Answer */}
        {question.type === 'multiple_answer' && question.answers && (
          <>
            {question.answers.map((answer) => {
              const isSelected = selectedAnswerIds.includes(answer.id);
              const showStatus = showResult && (isSelected || answer.isCorrect);
              const borderColor = showResult
                ? isSelected && !answer.isCorrect
                  ? 'border-red-300 bg-red-50'
                  : answer.isCorrect
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200'
                : isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300';

              return (
                <button
                  key={answer.id}
                  onClick={() => handleMultipleAnswer(answer.id)}
                  disabled={disabled}
                  className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${borderColor} ${
                    disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="flex-1 text-left text-gray-900">{answer.text}</span>
                  {renderAnswerStatus(answer.isCorrect, isSelected)}
                </button>
              );
            })}
          </>
        )}

        {/* True/False */}
        {question.type === 'true_false' && (
          <div className="flex gap-4">
            {[true, false].map((value) => {
              const isSelected = selectedBoolean === value;
              const isCorrect = question.correctAnswer === value;
              const borderColor = showResult
                ? isSelected && !isCorrect
                  ? 'border-red-300 bg-red-50'
                  : isCorrect
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200'
                : isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300';

              return (
                <button
                  key={value.toString()}
                  onClick={() => handleTrueFalse(value)}
                  disabled={disabled}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all ${borderColor} ${
                    disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                  }`}
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {value ? 'Đúng' : 'Sai'}
                  </span>
                  {showResult && renderAnswerStatus(isCorrect, isSelected)}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in the Blank */}
        {question.type === 'fill_blank' && (
          <div>
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => handleTextAnswer(e.target.value)}
              disabled={disabled}
              placeholder="Nhập câu trả lời..."
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                showResult
                  ? textAnswer.toLowerCase() === question.correctText?.toLowerCase()
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                  : 'border-gray-200'
              } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
            />
            {showResult && (
              <div className="mt-2 text-sm">
                <span className="font-semibold text-gray-700">Đáp án đúng: </span>
                <span className="text-green-600">{question.correctText}</span>
              </div>
            )}
          </div>
        )}

        {/* Matching - Simplified version */}
        {question.type === 'matching' && question.pairs && (
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="mb-3 text-sm text-gray-600">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Kéo thả để nối các cặp (chức năng đang phát triển)
            </p>
            {question.pairs.map((pair, index) => (
              <div key={pair.id} className="flex items-center gap-4 p-3 mb-2 bg-white rounded">
                <div className="flex-1 font-medium text-gray-900">{pair.left}</div>
                <div className="text-gray-400">→</div>
                <div className="flex-1 text-gray-700">{pair.right}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explanation */}
      {showResult && question.explanation && (
        <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="mb-1 font-semibold text-blue-900">Giải thích</h4>
              <p className="text-sm text-blue-800">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}