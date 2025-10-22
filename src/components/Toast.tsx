import React from 'react';

export default function Toast({ message }: { message: string }) {
  return (
    <div className="fixed right-6 bottom-6 z-60 rounded-lg bg-surface-700/90 border border-surface-600 px-4 py-2 text-sm text-surface-50 shadow-lg">
      {message}
    </div>
  );
}
