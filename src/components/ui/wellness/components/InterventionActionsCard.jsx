// frontend/src/components/ui/wellness/components/InterventionActionsCard.jsx
import React from 'react';
import { Target, Mail, Phone, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const InterventionActionsCard = ({ wellnessStatus, suggestedActions, studentEmail }) => {
  
  const status = wellnessStatus?.overall_status || 'green';

  const defaultActions = {
    'red': [
      {
        priority: 'urgent',
        action: 'Immediate Contact',
        description: 'Reach out to student immediately via phone or in-person meeting',
        icon: Phone
      },
      {
        priority: 'urgent',
        action: 'Crisis Protocol',
        description: 'Follow institutional crisis intervention procedures',
        icon: AlertCircle
      },
      {
        priority: 'urgent',
        action: 'Notify Counseling Services',
        description: 'Alert campus counseling center for immediate support',
        icon: FileText
      }
    ],
    'orange': [
      {
        priority: 'high',
        action: 'Schedule Check-in',
        description: 'Schedule a private meeting within 24-48 hours',
        icon: Calendar
      },
      {
        priority: 'high',
        action: 'Send Resources',
        description: 'Share mental health resources and counseling contact information',
        icon: Mail
      },
      {
        priority: 'high',
        action: 'Monitor Progress',
        description: 'Follow up on student\'s wellbeing over the next week',
        icon: CheckCircle
      }
    ],
    'yellow': [
      {
        priority: 'medium',
        action: 'Casual Check-in',
        description: 'Have a brief, informal conversation to show support',
        icon: Phone
      },
      {
        priority: 'medium',
        action: 'Monitor Status',
        description: 'Continue monitoring wellness status over next week',
        icon: Target
      }
    ],
    'green': [
      {
        priority: 'low',
        action: 'Continue Monitoring',
        description: 'Keep up regular wellness checks',
        icon: CheckCircle
      }
    ]
  };

  const actions = suggestedActions && suggestedActions.length > 0 
    ? suggestedActions 
    : defaultActions[status] || [];

  const getPriorityColor = (priority) => {
    const colors = {
      'urgent': 'bg-red-500/20 text-red-400 border-red-500/30',
      'high': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'low': 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[priority] || colors['medium'];
  };

  const getPriorityLabel = (priority) => {
    return priority?.toUpperCase() || 'MEDIUM';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-pink-400" />
        <h3 className="text-lg font-bold text-white">Suggested Actions</h3>
      </div>

      {/* Actions List */}
      <div className="space-y-4 mb-6">
        {actions.map((action, index) => {
          const Icon = action.icon || Target;
          return (
            <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white text-sm">{action.action}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityColor(action.priority)}`}>
                      {getPriorityLabel(action.priority)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{action.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400">Quick Actions</h4>
        
        {/* Email Student */}
        <a
          href={`mailto:${studentEmail}`}
          className="flex items-center gap-3 w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition"
        >
          <Mail className="w-5 h-5" />
          <span className="text-sm font-semibold">Email Student</span>
        </a>

        {/* Schedule Meeting */}
        <button
          onClick={() => alert('Calendar integration coming soon!')}
          className="flex items-center gap-3 w-full p-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-semibold">Schedule Meeting</span>
        </button>

        {/* Contact Counseling */}
        {status === 'red' && (
          <button
            onClick={() => alert('Contacting counseling services...')}
            className="flex items-center gap-3 w-full p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition animate-pulse"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Contact Counseling Services</span>
          </button>
        )}
      </div>

      {/* Emergency Notice */}
      {status === 'red' && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-sm font-semibold text-red-400 mb-1">Emergency Protocol</h5>
              <p className="text-xs text-red-300">
                This student requires immediate attention. Follow your institution's crisis intervention procedures.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resources */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h5 className="text-xs font-semibold text-gray-400 mb-2">Support Resources</h5>
        <div className="space-y-1 text-xs text-gray-500">
          <div>• Crisis Hotline: 988</div>
          <div>• Campus Counseling: Contact student services</div>
          <div>• Text Support: HOME to 741741</div>
        </div>
      </div>
    </div>
  );
};

export default InterventionActionsCard;