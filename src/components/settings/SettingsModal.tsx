import { useState,useEffect } from "react";
import { X, Trash2, Keyboard } from 'lucide-react'


interface SettingsModalProps {
    onClose: () => void
    onClearAll: () => void
    onSaveSettings: (settings:AppSettings) => void
    currentSettings: AppSettings
}

export interface AppSettings {
    historyLimitDays: number,
    globalShortcut: string

}

export default function SettingsModal ({
    onClose,
    onClearAll,
    onSaveSettings,
    currentSettings
}: SettingsModalProps) {
    const [historyLimitDays,setHistoryLimitDays] = useState(currentSettings.historyLimitDays)
    const [globalShortcut, setGlobalShortcut] = useState(currentSettings.globalShortcut)
    const [showClearConfirm, setShowClearConfirm] = useState(false)

    const handleSave = () => {
        onSaveSettings({historyLimitDays, globalShortcut})
        onClose()
    }

    const handleClearAll = () => {
        onClearAll()
        setShowClearConfirm(false)
        onClose()
    }

    return (
        <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {/* History Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              History Limit
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Automatically delete clips older than:
            </p>
            <select
              value={historyLimitDays}
              onChange={(e) => setHistoryLimitDays(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>6 months</option>
              <option value={365}>1 year</option>
              <option value={-1}>Never (keep forever)</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">
              {historyLimitDays === -1 
                ? 'Clips will never be automatically deleted' 
                : `Clips older than ${historyLimitDays} days will be deleted automatically`
              }
            </p>
          </div>

          {/* Global Shortcut */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Keyboard className="w-4 h-4" />
              Global Shortcut
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Keyboard shortcut to open clipboard manager:
            </p>
            <input
              type="text"
              value={globalShortcut}
              onChange={(e) => setGlobalShortcut(e.target.value)}
              placeholder="e.g., CommandOrControl+Shift+V"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-2">
              Use format: CommandOrControl+Shift+V (restart app to apply)
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Danger Zone */}
          <div>
            <label className="block text-sm font-medium text-red-600 mb-2">
              Danger Zone
            </label>
            
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium w-full justify-center"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Clips
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 mb-3 font-medium">
                  ⚠️ Are you sure? This will permanently delete all clips and cannot be undone!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Yes, Delete All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
    )
}