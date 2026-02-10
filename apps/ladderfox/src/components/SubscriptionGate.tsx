'use client';

import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature?: keyof NonNullable<ReturnType<typeof useSubscription>['subscription']>['features'];
  minPlan?: 'free' | 'basic' | 'pro' | 'team';
  quotaType?: keyof NonNullable<ReturnType<typeof useSubscription>['subscription']>['usageQuotas'];
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  upgradeMessage?: string;
  className?: string;
}

export function SubscriptionGate({
  children,
  feature,
  minPlan,
  quotaType,
  fallback,
  showUpgradePrompt = true,
  upgradeMessage,
  className = '',
}: SubscriptionGateProps) {
  const { subscription, loading, hasFeature, hasQuota, isAtLeastPlan, isActive } = useSubscription();

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Check feature access
  if (feature && !hasFeature(feature)) {
    if (fallback) return <>{fallback}</>;
    
    if (showUpgradePrompt) {
      return (
        <div className={`relative ${className}`}>
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-md mx-4 text-center"
            >
              <FiLock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Premium Feature
              </h3>
              <p className="text-gray-400 mb-6">
                {upgradeMessage || 'This feature is available in our premium plans. Upgrade to unlock it!'}
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all"
              >
                View Plans
                <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      );
    }
    
    return null;
  }

  // Check quota
  if (quotaType && !hasQuota(quotaType)) {
    if (fallback) return <>{fallback}</>;
    
    if (showUpgradePrompt) {
      return (
        <div className={`relative ${className}`}>
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-md mx-4 text-center"
            >
              <FiLock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Quota Exceeded
              </h3>
              <p className="text-gray-400 mb-6">
                {upgradeMessage || `You've reached your ${quotaType} limit. Upgrade to get more!`}
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all"
              >
                View Plans
                <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      );
    }
    
    return null;
  }

  // Check plan level
  if (minPlan && !isAtLeastPlan(minPlan)) {
    if (fallback) return <>{fallback}</>;
    
    if (showUpgradePrompt) {
      const planNames = {
        free: 'Free',
        basic: 'Basic',
        pro: 'Pro',
        team: 'Team',
      };
      
      return (
        <div className={`relative ${className}`}>
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-md mx-4 text-center"
            >
              <FiLock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {planNames[minPlan]} Plan Required
              </h3>
              <p className="text-gray-400 mb-6">
                {upgradeMessage || `This feature requires a ${planNames[minPlan]} plan or higher. Upgrade to unlock it!`}
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all"
              >
                View Plans
                <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      );
    }
    
    return null;
  }

  // Check if subscription is active
  if (!isActive) {
    if (fallback) return <>{fallback}</>;
    
    if (showUpgradePrompt) {
      return (
        <div className={`relative ${className}`}>
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-md mx-4 text-center"
            >
              <FiLock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Subscription Inactive
              </h3>
              <p className="text-gray-400 mb-6">
                {upgradeMessage || 'Your subscription is not active. Please renew to continue using premium features.'}
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all"
              >
                View Plans
                <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      );
    }
    
    return null;
  }

  // All checks passed, render children
  return <>{children}</>;
}

