import React, { useState } from 'react';
import { GrantOpportunity, GrantApplication, ApplicationStatus } from '../types/grants';

interface GrantApplicationTrackerProps {
  applications: GrantApplication[];
  grants: GrantOpportunity[];
  onUpdateApplication: (applicationId: string, updates: Partial<GrantApplication>) => void;
  onDeleteApplication: (applicationId: string) => void;
  onAddReminder: (applicationId: string, reminder: { date: string; message: string }) => void;
}

const GrantApplicationTracker: React.FC<GrantApplicationTrackerProps> = ({
  applications,
  grants,
  onUpdateApplication,
  onDeleteApplication,
  onAddReminder
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [showCompletedMaterials, setShowCompletedMaterials] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState<{ applicationId: string; date: string; message: string } | null>(null);

  // Get grant details for an application
  const getGrantDetails = (grantId: string): GrantOpportunity | undefined => {
    return grants.find(grant => grant.id === grantId);
  };

  // Filter applications by status
  const filteredApplications = applications.filter(app => 
    selectedStatus === 'all' || app.status === selectedStatus
  );

  // Get status color
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'not_started': return 'bg-surface-600 text-surface-300';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'submitted': return 'bg-blue-500/20 text-blue-400';
      case 'under_review': return 'bg-purple-500/20 text-purple-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'denied': return 'bg-red-500/20 text-red-400';
      case 'funded': return 'bg-green-600/20 text-green-300';
      default: return 'bg-surface-600 text-surface-300';
    }
  };

  // Calculate progress percentage
  const calculateProgress = (app: GrantApplication, grant: GrantOpportunity | undefined): number => {
    if (!grant) return 0;
    
    const totalMaterials = grant.requirements.application_materials.length;
    const completedMaterials = app.completed_materials.length;
    
    return Math.round((completedMaterials / totalMaterials) * 100);
  };

  // Get upcoming deadlines
  const getUpcomingDeadlines = () => {
    const now = new Date();
    return filteredApplications
      .map(app => {
        const grant = getGrantDetails(app.grant_id);
        if (!grant) return null;
        
        const deadline = new Date(grant.timeline.application_deadline);
        const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        return { app, grant, daysUntil };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null && item.daysUntil <= 30 && item.daysUntil > 0)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  // Format deadline urgency
  const formatDeadlineUrgency = (daysUntil: number) => {
    if (daysUntil <= 0) return { text: 'Past due', color: 'text-red-400' };
    if (daysUntil === 1) return { text: 'Due tomorrow', color: 'text-red-400' };
    if (daysUntil <= 3) return { text: `${daysUntil} days left`, color: 'text-red-400' };
    if (daysUntil <= 7) return { text: `${daysUntil} days left`, color: 'text-yellow-400' };
    if (daysUntil <= 14) return { text: `${daysUntil} days left`, color: 'text-orange-400' };
    return { text: `${daysUntil} days left`, color: 'text-surface-300' };
  };

  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-surface-50">Grant Applications</h2>
          <p className="text-sm text-surface-400">
            Track your grant applications and deadlines
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {['all', 'in_progress', 'submitted', 'under_review', 'approved', 'denied'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status as any)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedStatus === status
                  ? 'bg-primary-600 text-primary-50'
                  : 'bg-surface-700 text-surface-300 hover:bg-surface-600'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
              <span className="ml-1 text-xs opacity-75">
                ({status === 'all' ? applications.length : applications.filter(app => app.status === status).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines Alert */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-yellow-300 mb-3 flex items-center gap-2">
            ⚠️ Upcoming Deadlines
          </h3>
          <div className="space-y-2">
            {upcomingDeadlines.slice(0, 3).map(({ app, grant, daysUntil }) => {
              const urgency = formatDeadlineUrgency(daysUntil);
              return (
                <div key={app.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-surface-200 text-sm font-medium">{grant.title}</div>
                    <div className="text-surface-400 text-xs">{app.project_title}</div>
                  </div>
                  <div className={`text-sm font-medium ${urgency.color}`}>
                    {urgency.text}
                  </div>
                </div>
              );
            })}
            {upcomingDeadlines.length > 3 && (
              <div className="text-xs text-yellow-400 mt-2">
                +{upcomingDeadlines.length - 3} more applications with upcoming deadlines
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-surface-800/30 rounded-xl border border-surface-700">
            <div className="text-surface-400 mb-2">No applications found</div>
            <div className="text-sm text-surface-500">
              {selectedStatus === 'all' 
                ? 'Start applying to grants to track your progress here'
                : `No applications with status: ${selectedStatus.replace('_', ' ')}`
              }
            </div>
          </div>
        ) : (
          filteredApplications.map((app) => {
            const grant = getGrantDetails(app.grant_id);
            if (!grant) return null;

            const progress = calculateProgress(app, grant);
            const deadline = new Date(grant.timeline.application_deadline);
            const daysUntil = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const urgency = formatDeadlineUrgency(daysUntil);

            return (
              <div 
                key={app.id} 
                className="bg-surface-800/50 rounded-xl border border-surface-700 p-6"
              >
                {/* Application Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-surface-50 truncate">
                        {app.project_title}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ')}
                      </div>
                    </div>
                    
                    <div className="text-surface-400 text-sm mb-2">
                      {grant.title} • {grant.funder_name}
                    </div>
                    
                    <div className="text-surface-300 text-sm">
                      Requesting: ${app.requested_amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-surface-400 text-sm">Deadline</div>
                    <div className={`font-medium ${urgency.color}`}>
                      {deadline.toLocaleDateString()}
                    </div>
                    <div className={`text-xs ${urgency.color}`}>
                      {urgency.text}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-surface-400">Application Progress</span>
                    <span className="text-sm text-surface-300">{progress}%</span>
                  </div>
                  <div className="w-full bg-surface-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Materials Checklist */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold text-surface-200 mb-2">Required Materials</h4>
                    <div className="space-y-2">
                      {grant.requirements.application_materials.map((material, index) => {
                        const isCompleted = app.completed_materials.includes(material);
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                const updatedCompleted = isCompleted 
                                  ? app.completed_materials.filter(m => m !== material)
                                  : [...app.completed_materials, material];
                                
                                onUpdateApplication(app.id, { 
                                  completed_materials: updatedCompleted,
                                  last_updated: new Date().toISOString()
                                });
                              }}
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                isCompleted 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-surface-500 hover:border-surface-400'
                              }`}
                            >
                              {isCompleted && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <span className={`text-sm ${isCompleted ? 'text-surface-300 line-through' : 'text-surface-200'}`}>
                              {material}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    {/* Status Update */}
                    <h4 className="text-sm font-semibold text-surface-200 mb-2">Update Status</h4>
                    <select
                      value={app.status}
                      onChange={(e) => {
                        onUpdateApplication(app.id, { 
                          status: e.target.value as ApplicationStatus,
                          last_updated: new Date().toISOString()
                        });
                      }}
                      className="w-full bg-surface-700 rounded-lg px-3 py-2 text-surface-100 mb-3"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="denied">Denied</option>
                      <option value="funded">Funded</option>
                    </select>

                    {/* Notes */}
                    <h4 className="text-sm font-semibold text-surface-200 mb-2">Notes</h4>
                    <textarea
                      value={app.notes}
                      onChange={(e) => {
                        onUpdateApplication(app.id, { 
                          notes: e.target.value,
                          last_updated: new Date().toISOString()
                        });
                      }}
                      placeholder="Add notes about this application..."
                      className="w-full bg-surface-700 rounded-lg px-3 py-2 text-surface-100 text-sm h-20 resize-none"
                    />
                  </div>
                </div>

                {/* Reminders */}
                {app.reminders.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-surface-200 mb-2">Reminders</h4>
                    <div className="space-y-2">
                      {app.reminders.map((reminder, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            reminder.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-surface-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                const updatedReminders = [...app.reminders];
                                updatedReminders[index] = { ...reminder, completed: !reminder.completed };
                                onUpdateApplication(app.id, { reminders: updatedReminders });
                              }}
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                reminder.completed 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-surface-500 hover:border-surface-400'
                              }`}
                            >
                              {reminder.completed && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <div>
                              <div className={`text-sm ${reminder.completed ? 'text-surface-400 line-through' : 'text-surface-200'}`}>
                                {reminder.message}
                              </div>
                              <div className="text-xs text-surface-500">
                                {new Date(reminder.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-700">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNewReminder({
                        applicationId: app.id,
                        date: '',
                        message: ''
                      })}
                      className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-primary-50 rounded-lg text-sm transition-colors"
                    >
                      Add Reminder
                    </button>
                    
                    {grant.funder_website && (
                      <a
                        href={grant.funder_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-surface-600 hover:bg-surface-500 text-surface-200 rounded-lg text-sm transition-colors"
                      >
                        Funder Website
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onDeleteApplication(app.id)}
                    className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Reminder Modal */}
      {newReminder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-surface-50 mb-4">Add Reminder</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">
                  Reminder Date
                </label>
                <input
                  type="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder(prev => prev ? { ...prev, date: e.target.value } : null)}
                  className="w-full bg-surface-700 rounded-lg px-3 py-2 text-surface-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">
                  Message
                </label>
                <textarea
                  value={newReminder.message}
                  onChange={(e) => setNewReminder(prev => prev ? { ...prev, message: e.target.value } : null)}
                  placeholder="What do you need to remember?"
                  className="w-full bg-surface-700 rounded-lg px-3 py-2 text-surface-100 h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (newReminder.date && newReminder.message) {
                    onAddReminder(newReminder.applicationId, {
                      date: newReminder.date,
                      message: newReminder.message
                    });
                  }
                  setNewReminder(null);
                }}
                disabled={!newReminder.date || !newReminder.message}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-600 disabled:text-surface-400 text-primary-50 rounded-lg transition-colors"
              >
                Add Reminder
              </button>
              <button
                onClick={() => setNewReminder(null)}
                className="px-4 py-2 bg-surface-600 hover:bg-surface-500 text-surface-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantApplicationTracker;