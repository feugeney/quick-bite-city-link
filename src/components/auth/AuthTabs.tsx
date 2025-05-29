
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const AuthTabs = ({ activeTab, onTabChange }: AuthTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4 sm:space-y-6">
      <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-white/30">
        <TabsTrigger value="login" className="rounded-lg sm:rounded-xl data-[state=active]:bg-primary-500 data-[state=active]:text-white font-semibold text-sm">
          Connexion
        </TabsTrigger>
        <TabsTrigger value="register" className="rounded-lg sm:rounded-xl data-[state=active]:bg-primary-500 data-[state=active]:text-white font-semibold text-sm">
          Inscription
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <LoginForm />
      </TabsContent>

      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
