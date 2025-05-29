
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock } from 'lucide-react';

const LoginForm = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoginLoading(true);
      const { isAdmin } = await signIn(loginEmail, loginPassword);
      
      // Redirect based on user role
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <Card className="card-guinea border-0 shadow-2xl">
      <CardHeader className="space-y-1 pb-4 sm:pb-6 text-center px-4 sm:px-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Bon retour !</CardTitle>
        <CardDescription className="text-gray-600 text-base sm:text-lg">
          Connectez-vous pour savourer nos délices
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="pl-10 sm:pl-12 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-primary-400 text-base sm:text-lg"
                required
              />
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Mot de passe</Label>
              <Button variant="link" className="px-0 font-medium text-primary-600 hover:text-primary-700 text-xs sm:text-sm">
                Mot de passe oublié?
              </Button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
              <Input
                id="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="pl-10 sm:pl-12 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-primary-400 text-base sm:text-lg"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4 sm:px-6">
          <Button
            type="submit"
            className="w-full btn-guinea h-12 sm:h-14 text-base sm:text-lg"
            disabled={loginLoading}
          >
            {loginLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
