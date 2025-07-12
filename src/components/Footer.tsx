'use client';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          <p className="mb-2">
            ※ このアプリは参考情報を提供するものです。実際の予約・搭乗の際は必ず各航空会社の公式サイトでご確認ください。
          </p>
          <p className="text-sm">
            マイル要件・運賃は変更される場合があります。最新情報は各航空会社の公式サイトをご確認ください。
          </p>
        </div>
      </div>
    </footer>
  );
}
