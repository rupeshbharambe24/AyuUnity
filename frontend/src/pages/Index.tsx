
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Healthcare Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive healthcare management solution
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Patient Dashboard</CardTitle>
                <CardDescription>
                  Access your medical records and appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Access Dashboard</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Doctor Portal</CardTitle>
                <CardDescription>
                  Manage patients and medical consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">Doctor Login</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Scan Analysis</CardTitle>
                <CardDescription>
                  AI-powered medical scan analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">Start Analysis</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
