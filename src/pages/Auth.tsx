
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthTabs from "@/components/auth/AuthTabs";

const Auth = () => {
  const { user, loading, createAdminAccount } = useAuth();
  const location = useLocation();
  
  // Utiliser le paramètre d'URL pour définir l'onglet actif
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl === "register" ? "register" : "login");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // If user is already logged in, redirect to home page
  if (!loading && user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthLayout onCreateAdminAccount={createAdminAccount}>
      <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />
    </AuthLayout>
  );
};

export default Auth;
