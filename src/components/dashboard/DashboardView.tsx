/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { FreelancerDashboard } from './FreelancerDashboard';
import { ClientDashboard } from './ClientDashboard';

interface DashboardViewProps {
  onNavigate: (page: string, params?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    onNavigate('auth');
    return null;
  }

  if (currentUser.role === 'freelancer') {
    return <FreelancerDashboard onNavigate={onNavigate} />;
  } else {
    return <ClientDashboard onNavigate={onNavigate} />;
  }
};
