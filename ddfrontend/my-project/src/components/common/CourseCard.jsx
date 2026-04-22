import React from "react";

const CourseCard = ({
  topTitle,
  programTitle,
  courseName,
  features,
  priceText,
  enrollButtonText,
  isEnrolled,
  onEnrollClick,
}) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-gray-100 overflow-hidden relative">
      {/* Gradient Background Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
          {topTitle}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
        {courseName}
      </h3>

      {/* Subtitle */}
      {programTitle && (
        <p className="text-lg font-semibold text-blue-600 mb-4">
          {programTitle}
        </p>
      )}

      {/* Features List */}
      <ul className="flex-grow mb-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-700">
            <span className="text-green-500 font-bold mr-3 flex-shrink-0">✓</span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Price Section */}
      {priceText && (
        <div className="mb-6 text-center">
          <p className="text-gray-600 text-sm font-medium mb-1">Starting at</p>
          <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {priceText}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => onEnrollClick(courseName)}
          className={`flex-1 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform active:scale-95 ${
            isEnrolled
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:scale-105"
          }`}
          disabled={isEnrolled}
        >
          {isEnrolled ? "✓ Enrolled" : enrollButtonText}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
