
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Settings } from 'lucide-react';
import AdminSettings from '@/components/AdminSettings';
import { Link } from "react-router-dom";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // En un entorno real, esta contraseña vendría del backend
  const ADMIN_PASSWORD = 'admin123';
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulamos una petición al backend
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        setError('Contraseña incorrecta. Inténtalo de nuevo.');
      }
      setIsLoading(false);
    }, 800);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-osteo-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </header>
          
          <AdminSettings />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Lock className="h-5 w-5 text-osteo-500" />
            Acceso Administración
          </CardTitle>
          <CardDescription>
            Introduce la contraseña para acceder al panel de administración
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Introduce la contraseña"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-osteo-500 hover:bg-osteo-600"
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Acceder'}
            </Button>
          </CardFooter>
        </form>
        <div className="p-4 text-center">
          <Link to="/" className="text-sm text-osteo-500 hover:text-osteo-700">
            Volver a la página principal
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Admin;
