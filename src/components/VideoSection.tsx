/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ExternalLink,
  Film,
  Users,
  Video,
} from 'lucide-react';

/*
 * วิดีโอส่วนที่ 1: วิดีโออธิบายโปรแกรม
 */
const VIDEO_1_URL =
  'https://youtu.be/unWcTIsrMGI';

/*
 * วิดีโอส่วนที่ 2: เบื้องหลังการใช้ AI
 * ลิงก์คลิปวิดีโอการนำ AI มาใช้ในการทำ CPU Scheduling
 */
const VIDEO_2_URL = 'https://youtu.be/UMgsffcb5eg';

/*
 * แปลงลิงก์ YouTube หรือ Google Drive
 * ให้เป็นลิงก์สำหรับฝังใน iframe
 */
const getEmbedUrl = (
  rawUrl: string
): string | null => {
  if (!rawUrl.trim()) {
    return null;
  }

  const trimmedUrl = rawUrl.trim();

  /*
   * รองรับลิงก์ YouTube:
   * https://youtu.be/VIDEO_ID
   * https://www.youtube.com/watch?v=VIDEO_ID
   * https://www.youtube.com/embed/VIDEO_ID
   */
  const youtubeMatch = trimmedUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  /*
   * รองรับลิงก์ Google Drive:
   * https://drive.google.com/file/d/FILE_ID/view
   */
  const driveFileMatch = trimmedUrl.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );

  if (driveFileMatch) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  }

  /*
   * รองรับลิงก์ Google Drive รูปแบบ:
   * https://drive.google.com/open?id=FILE_ID
   * https://drive.google.com/uc?id=FILE_ID
   */
  const driveIdMatch = trimmedUrl.match(
    /drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/
  );

  if (driveIdMatch) {
    return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
  }

  return trimmedUrl;
};

export const VideoSection: React.FC = () => {
  const embedVideo1 =
    getEmbedUrl(VIDEO_1_URL);

  const embedVideo2 =
    getEmbedUrl(VIDEO_2_URL);

  return (
    <section
      id="video-presentation"
      className="scroll-mt-20 py-12 border-t border-slate-200"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold uppercase tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3.5 py-1.5 rounded-xl font-mono mb-3">
          <span>
            ส่วนที่ 6 · วิดีโอนำเสนอและสาธิตโครงงาน
            (Project Videos)
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3">
          วิดีโอนำเสนอผลงาน Term Project
        </h2>

        <p className="text-lg sm:text-xl text-slate-600 mt-2.5 max-w-4xl leading-relaxed">
          วิดีโออธิบายโปรแกรมและวิดีโอเบื้องหลัง
          การใช้ AI ตามข้อกำหนดของโครงงาน
        </p>
      </div>

      {/* Video Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Video 1 */}
        <div
          id="vdo-demo"
          className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col scroll-mt-24"
        >
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-base">
              <Video className="w-5 h-5 shrink-0" />

              <span>
                วิดีโอส่วนที่ 1:
                วิดีโออธิบายโปรแกรม
              </span>
            </div>

            <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-full">
              สาธิตและอธิบายโค้ด
            </span>
          </div>

          {/* YouTube Player */}
          <div className="relative aspect-video w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden mb-4 shadow-inner">
            {embedVideo1 ? (
              <iframe
                src={embedVideo1}
                title="วิดีโออธิบายโปรแกรม CPU Scheduling"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center p-6 text-slate-400">
                <div>
                  <Film className="w-12 h-12 mx-auto text-slate-600 mb-3" />

                  <p className="font-bold text-slate-200 text-sm">
                    ไม่พบลิงก์วิดีโอส่วนที่ 1
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* YouTube Link */}
          <a
            href={VIDEO_1_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full mb-5 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-sm font-bold text-indigo-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />

            <span>
              เปิดวิดีโอบน YouTube
            </span>
          </a>

          {/* Video 1 Checklist */}
          <div
            id="vdo-criteria"
            className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs sm:text-sm scroll-mt-24"
          >
            <div className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />

              <span>
                ประเด็นที่ครอบคลุมในวิดีโอส่วนที่ 1
              </span>
            </div>

            <ul className="text-slate-600 space-y-1.5 leading-relaxed">
              <li>
                • อธิบายหลักการทำงานของ FCFS, SJF
                และ Round Robin
              </li>

              <li>
                • อธิบายโครงสร้างโปรแกรมและ
                การคำนวณ ST, CT, TAT, WT และ AVG WT
              </li>

              <li>
                • สาธิตการกำหนด Burst Time
                การสุ่มค่า และการเปลี่ยน Time Quantum
              </li>

              <li>
                • เปรียบเทียบผลลัพธ์ของแต่ละ
                อัลกอริทึมด้วยข้อมูลชุดเดียวกัน
              </li>
            </ul>
          </div>
        </div>

        {/* Video 2 */}
        <div
          id="vdo-ai"
          className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col scroll-mt-24"
        >
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-purple-600 font-bold text-base">
              <Video className="w-5 h-5 shrink-0" />

              <span>
                วิดีโอส่วนที่ 2:
                วิดีโอเบื้องหลังการใช้ AI
              </span>
            </div>

            <span className="text-xs text-purple-700 font-mono bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              ความโปร่งใสทางวิชาการ
            </span>
          </div>

          {/* Google Drive Player */}
          <div className="relative aspect-video w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden mb-4 shadow-inner">
            {embedVideo2 ? (
              <iframe
                src={embedVideo2}
                title="วิดีโอเบื้องหลังการใช้ AI"
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center p-6 text-slate-400">
                <div>
                  <Film className="w-12 h-12 mx-auto text-slate-600 mb-3" />

                  <p className="font-bold text-slate-200 text-sm">
                    กำลังเตรียมวิดีโอส่วนที่ 2
                  </p>

                  <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    เมื่อได้ลิงก์ Google Drive
                    ให้นำไปใส่ในตัวแปร VIDEO_2_URL
                    ที่ด้านบนของไฟล์
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video 2 External Link */}
          {VIDEO_2_URL ? (
            <a
              href={VIDEO_2_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full mb-5 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-sm font-bold text-purple-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />

              <span>
                {VIDEO_2_URL.includes('youtu') ? 'เปิดวิดีโอบน YouTube' : 'เปิดวิดีโอบน Google Drive'}
              </span>
            </a>
          ) : (
            <div className="w-full mb-5 px-4 py-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
              ยังไม่ได้เพิ่มลิงก์วิดีโอ
            </div>
          )}

          {/* Video 2 Checklist */}
          <div className="bg-purple-50/60 border border-purple-200/70 rounded-xl p-4 text-xs sm:text-sm">
            <div className="font-bold text-purple-950 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-700 shrink-0" />

              <span>
                ประเด็นที่ต้องครอบคลุมในวิดีโอส่วนที่ 2
              </span>
            </div>

            <ul className="text-purple-900 space-y-1.5 leading-relaxed">
              <li>
                • ระบุขั้นตอนที่ใช้ AI ช่วยวางแผน
                คำนวณ เขียนโค้ด และนำเสนอ
              </li>

              <li>
                • แสดงเครื่องมือ AI และตัวอย่าง
                Prompt ที่ใช้จริง
              </li>

              <li>
                • อธิบายวิธีตรวจสอบและแก้ไข
                ผลลัพธ์ที่ AI สร้าง
              </li>

              <li>
                • ยืนยันว่าสมาชิกเข้าใจโค้ด
                ทุกส่วนที่นำมาใช้
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};