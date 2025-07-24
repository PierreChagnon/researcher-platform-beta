"use client"
import React, { useState, useEffect } from 'react';

const TextCarousel = () => {
    const texts = [
        "Manual updates of your publication list",
        "Outdated website designs",
        "Setup up domain and hosting",
        "Complex CRM",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
                setIsAnimating(false);
            }, 300);
        }, 3000);

        return () => clearInterval(interval);
    }, [texts.length]);

    const getVisibleTexts = () => {
        const visibleTexts = [];
        for (let i = -2; i <= 2; i++) {
            const index = (currentIndex + i + texts.length) % texts.length;
            visibleTexts.push({
                text: texts[index],
                position: i,
                index: index
            });
        }
        return visibleTexts;
    };

    const getTextStyle = (position) => {
        const baseClasses = "transition-all duration-300 ease-in-out text-center lg:text-start";

        if (position === 0) {
            return `${baseClasses} bg-gradient-to-r from-[#FF2F2F] via-[#EF7B16] to-[#D511FD] bg-clip-text text-transparent text-2xl lg:text-4xl font-bold`;
        } else if (Math.abs(position) === 1) {
            return `${baseClasses} text-gray-600 opacity-70 text-xl lg:text-3xl font-semibold`;
        } else {
            return `${baseClasses} text-gray-400 opacity-40 text-xl lg:text-3xl font-semibold`;
        }
    };

    const getTranslateY = (position) => {
        return position * 60; // 60px d'espacement entre les lignes
    };

    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 justify-center mx-auto px-6">
            <h2 className='text-black text-center lg:text-end text-nowrap text-4xl leading-tight font-bold mb-12 lg:mb-0 lg:w-1/2'>👋 Wave goodbye to</h2>
            <div className="relative w-full lg:w-1/2">
                <div
                    className="relative h-80 overflow-hidden flex items-center justify-center lg:justify-start"
                >
                    {getVisibleTexts().map((item, index) => (
                        <div
                            key={`${item.index}-${currentIndex}-${index}`}
                            className={`absolute ${getTextStyle(item.position)}`}
                            style={{
                                transform: `translateY(${getTranslateY(item.position)}px) ${isAnimating ? 'translateY(-60px)' : ''
                                    }`,
                                transition: 'all 0.3s ease-in-out'
                            }}
                        >
                            {item.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TextCarousel;