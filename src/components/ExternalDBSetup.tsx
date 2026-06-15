import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Database, Copy, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export const ExternalDBSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sqlScript, setSqlScript] = useState('');
  const [copied, setCopied] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const setupExternalDatabase = async () => {
    setIsLoading(true);
    try {
      toast.info('Creating schema in external database...');
      const { data, error } = await supabase.functions.invoke('setup-external-db');
      
      if (error) throw error;

      if (data.sql) {
        setSqlScript(data.sql);
        toast.warning('Manual SQL Execution Required', {
          description: 'Copy the SQL script below and run it in your external Supabase SQL Editor'
        });
      } else {
        toast.success('Schema Created!', {
          description: data.message
        });
        setSetupComplete(true);
      }
    } catch (error: any) {
      toast.error('Setup Failed', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncExistingData = async () => {
    setIsSyncing(true);
    try {
      toast.info('Syncing existing data to external database...');
      const { data, error } = await supabase.functions.invoke('initial-sync');
      
      if (error) throw error;

      toast.success('Data Synced!', {
        description: data.message
      });
    } catch (error: any) {
      toast.error('Sync Failed', {
        description: error.message
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    toast.success('SQL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          External Database Setup
        </CardTitle>
        <CardDescription>
          Create the same table structure in your external Supabase project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 1: Create Schema</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create the database structure in your external Supabase project.
            </p>
            <Button 
              onClick={setupExternalDatabase} 
              disabled={isLoading || setupComplete}
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Schema...
                </>
              ) : setupComplete ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Schema Created
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Create External Database Schema
                </>
              )}
            </Button>
          </div>

          {setupComplete && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 2: Sync Existing Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Copy all existing data from this database to the external backup.
              </p>
              <Button 
                onClick={syncExistingData} 
                disabled={isSyncing}
                size="lg"
                variant="secondary"
                className="w-full"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing Data...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Sync All Existing Data
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {sqlScript && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">SQL Schema Script</label>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy SQL
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={sqlScript}
              readOnly
              className="font-mono text-xs h-96"
            />
            <p className="text-xs text-muted-foreground">
              Copy this SQL and run it in your external Supabase project's SQL Editor to create all tables, functions, and policies.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
