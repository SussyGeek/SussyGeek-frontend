import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Navigate, useNavigate } from 'react-router-dom';

const InstituteNotFound = () => {
    const navigate = useNavigate();
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Institution Not Found</CardTitle>
              <CardDescription>The institution you're looking for doesn't exist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")}>Go Home</Button>
            </CardContent>
          </Card>
      </div>
    )
}

export default InstituteNotFound;