// frontend/src/components/ui/wellness/components/ResourcesCard.jsx
import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ExternalLink, Heart, Book, Activity } from 'lucide-react';
import { getWellnessResources } from '../../../../api/wellnessApi';

const ResourcesCard = () => {
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await getWellnessResources();
      setResources(data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="h-20 bg-white/10 rounded"></div>
          <div className="h-20 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-pink-400" />
        <h3 className="text-xl font-bold text-white">Mental Health Resources</h3>
      </div>

      {/* Crisis Helplines */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Crisis Helplines (24/7)
        </h4>
        <div className="space-y-3">
          {resources?.crisis_helplines?.map((helpline, index) => (
            <div
              key={index}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-semibold text-white mb-1">{helpline.name}</h5>
                  <p className="text-sm text-gray-400 mb-2">{helpline.description}</p>
                  <a
                    href={`tel:${helpline.number.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-2 text-red-300 font-semibold hover:text-red-200"
                  >
                    <Phone className="w-4 h-4" />
                    {helpline.number}
                  </a>
                </div>
                <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">
                  {helpline.available}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Resources */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <Book className="w-4 h-4" />
          Campus Resources
        </h4>
        <div className="space-y-3">
          {resources?.campus_resources?.map((resource, index) => (
            <div
              key={index}
              className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{resource.icon}</span>
                <div className="flex-1">
                  <h5 className="font-semibold text-white mb-1">{resource.name}</h5>
                  <p className="text-sm text-gray-400 mb-2">{resource.description}</p>
                  <p className="text-xs text-blue-300">{resource.contact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Self-Help Activities */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Self-Help Activities
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {resources?.self_help_activities?.map((activity, index) => (
            <div
              key={index}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <h5 className="font-semibold text-white text-sm mb-1">{activity.title}</h5>
                  <p className="text-xs text-gray-400 mb-2">{activity.description}</p>
                  <span className="text-xs text-green-300">{activity.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Online Support */}
      <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Online Support
        </h4>
        <div className="space-y-2">
          {resources?.online_support?.map((service, index) => (
            <a
              key={index}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-white text-sm mb-1">{service.name}</h5>
                  <p className="text-xs text-gray-400">{service.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <p className="text-sm text-red-300 text-center">
          <strong>In case of emergency:</strong> Call 911 or go to your nearest emergency room
        </p>
      </div>
    </div>
  );
};

export default ResourcesCard;