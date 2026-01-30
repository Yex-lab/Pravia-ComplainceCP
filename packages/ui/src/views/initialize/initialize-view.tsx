'use client';

import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { AnimateLogoZoom, useNotificationStore, LiquidButton, showExpandableError, dismissNotification } from '@asyml8/ui';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

/**
 * Configuration for a service to be loaded during initialization
 */
export interface ServiceConfig<T = any> {
  /** Unique identifier for the service */
  name: string;
  /** Async function that loads the service data */
  fn: () => Promise<T>;
  /** Function to store the loaded data (e.g., Zustand setter) */
  setter: (data: T) => void;
  /** Whether failure of this service should block initialization */
  critical: boolean;
  /** Loading message to display while this service loads */
  message: string;
}

/**
 * Error information for a failed service
 */
export interface ServiceError {
  /** Name of the service that failed */
  service: string;
  /** Error message */
  error: string;
  /** Whether this was a critical service */
  critical: boolean;
}

/**
 * Result of a successfully loaded service
 */
export interface ServiceResult {
  /** Name of the service */
  service: string;
  /** Data returned by the service */
  data: any;
}

/**
 * Props for the InitializeView component
 */
export interface InitializeViewProps {
  /** Array of services to load in parallel */
  services: ServiceConfig[];
  /** Callback before services start loading (return false to prevent initialization) */
  onPreInitialize?: () => boolean | Promise<boolean>;
  /** Callback to validate loaded service data (return false to treat as error) */
  onValidate?: (results: ServiceResult[]) => boolean | Promise<boolean>;
  /** Callback when all services load successfully */
  onSuccess: () => void;
  /** Callback when critical services fail */
  onError: (errors: ServiceError[]) => void;
  /** Custom logo component to display */
  logo?: React.ReactNode;
  /** Interval in ms for rotating messages (default: 1500) */
  messageInterval?: number;
  /** Background animations to display */
  backgroundAnimations?: React.ReactNode;
  /** Error display mode: 'service' shows individual errors, 'summary' shows single message (default: 'service') */
  errorDisplay?: 'service' | 'summary';
  /** Failure mode: 'critical' blocks only on critical errors, 'all' blocks on any error (default: 'all') */
  failureMode?: 'critical' | 'all';
  /** Delay in ms before calling onSuccess after successful initialization (default: 1000) */
  redirectDelay?: number;
  /** Timeout in ms for initialization (default: 30000) */
  initTimeout?: number;
  /** Localized text for initialization failed message */
  failedText?: string;
  /** Localized text for retry button */
  retryText?: string;
  /** Localized text for failed services summary (receives count) */
  failedServicesSummary?: (count: number) => string;
  /** Custom sx styles for the retry button */
  buttonSx?: any;
  /** Custom sx styles for the container */
  containerSx?: any;
  /** Optional logout handler - if provided, shows logout button on failure */
  onLogout?: () => void;
  /** Localized text for logout button */
  logoutText?: string;
  /** Localized text for system unavailable error */
  systemUnavailableText?: string;
}

/**
 * Full-page initialization view that loads services in parallel
 * and displays animated loading state with rotating messages.
 *
 * @example
 * ```tsx
 * <InitializeView
 *   services={[
 *     { name: 'user', fn: loadUser, setter: setUser, critical: true, message: 'Loading user...' }
 *   ]}
 *   onSuccess={() => navigate('/dashboard')}
 *   onError={(errors) => console.error(errors)}
 *   logo={<Logo />}
 *   backgroundAnimations={<ParticleBackground />}
 * />
 * ```
 */
export function InitializeView({
  services,
  onPreInitialize,
  onValidate,
  onSuccess,
  onError,
  logo,
  messageInterval = 1500,
  backgroundAnimations,
  errorDisplay = 'service',
  failureMode = 'all',
  redirectDelay = 1000,
  initTimeout = 30000,
  failedText = 'Initialization Failed',
  retryText = 'Retry',
  failedServicesSummary = (count) => `Failed to load ${count} service${count > 1 ? 's' : ''}`,
  buttonSx,
  containerSx,
  onLogout,
  logoutText = 'Logout',
  systemUnavailableText = 'System Unavailable',
}: InitializeViewProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);
  const [serviceErrors, setServiceErrors] = useState<ServiceError[]>([]);
  const [errorNotificationId, setErrorNotificationId] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Extract messages from services
  const messages = services.map((service) => service.message);

  const loadServices = async () => {
    // Prevent double loading
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    setHasFailed(false);

    // Set timeout
    timeoutRef.current = setTimeout(() => {
      const timeoutError: ServiceError = {
        service: 'timeout',
        error: `Initialization timed out after ${initTimeout}ms`,
        critical: true,
      };
      setHasFailed(true);
      onError([timeoutError]);
      hasLoadedRef.current = false; // Allow retry
    }, initTimeout);

    // Call onPreInitialize if provided
    if (onPreInitialize) {
      try {
        const canProceed = await onPreInitialize();
        if (!canProceed) {
          const preInitError: ServiceError = {
            service: 'pre-initialization',
            error: 'Pre-initialization check failed',
            critical: true,
          };
          setHasFailed(true);
          onError([preInitError]);
          return;
        }
      } catch (error: any) {
        const preInitError: ServiceError = {
          service: 'pre-initialization',
          error: error?.message || 'Pre-initialization error',
          critical: true,
        };
        setHasFailed(true);
        onError([preInitError]);
        return;
      }
    }

    // Load all services in parallel
    const results = await Promise.allSettled(services.map((service) => service.fn()));

    const serviceErrors: ServiceError[] = [];
    const successfulResults: ServiceResult[] = [];

    // Process results and collect errors
    results.forEach((result, index) => {
      const service = services[index];

      if (result.status === 'fulfilled') {
        service.setter(result.value);
        successfulResults.push({
          service: service.name,
          data: result.value,
        });
      } else {
        const errorMessage = result.reason?.message || 'Unknown error';
        const error = {
          service: service.name,
          error: errorMessage === 'Network Error' ? systemUnavailableText : errorMessage,
          critical: service.critical,
        };
        serviceErrors.push(error);
      }
    });

    // Call onValidate if provided and no critical errors yet
    if (onValidate && serviceErrors.length === 0) {
      try {
        const isValid = await onValidate(successfulResults);
        if (!isValid) {
          const validationError: ServiceError = {
            service: 'validation',
            error: 'Service data validation failed',
            critical: true,
          };
          serviceErrors.push(validationError);
        }
      } catch (error: any) {
        const validationError: ServiceError = {
          service: 'validation',
          error: error?.message || 'Validation error',
          critical: true,
        };
        serviceErrors.push(validationError);
      }
    }

    // Display errors based on errorDisplay mode
    if (serviceErrors.length > 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      // Store errors for expandable notification
      setServiceErrors(serviceErrors);
      
      if (errorDisplay === 'service') {
        // Show individual service errors
        serviceErrors.forEach((error) => {
          addNotification({
            id: `init-error-${error.service}-${Date.now()}`,
            type: error.critical ? 'error' : 'warning',
            message: error.error,
            duration: error.critical ? 0 : 5000,
            persist: error.critical,
          });
        });
      } else {
        // Summary mode - show expandable error notification
        const id = showExpandableError(
          failedText,
          serviceErrors.map((e) => ({
            service: e.service,
            message: e.error,
          })),
          {
            onRetry: handleRetry,
            retryText,
          }
        );
        setErrorNotificationId(id);
      }

      // Determine if we should block based on failureMode
      const hasCriticalErrors = serviceErrors.some((e) => e.critical);
      const shouldBlock = failureMode === 'all' || (failureMode === 'critical' && hasCriticalErrors);

      if (shouldBlock) {
        setHasFailed(true);
      }

      onError(serviceErrors);

      // Proceed to onSuccess if not blocking
      if (!shouldBlock) {
        setTimeout(onSuccess, redirectDelay);
      }
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTimeout(onSuccess, redirectDelay);
    }
  };

  useEffect(() => {
    // Rotate through loading messages
    const messageTimer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, messageInterval);

    loadServices();

    return () => {
      clearInterval(messageTimer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    // Dismiss the error notification if it exists
    if (errorNotificationId) {
      dismissNotification(errorNotificationId);
      setErrorNotificationId(null);
    }
    hasLoadedRef.current = false;
    setHasFailed(false);
    setServiceErrors([]);
    setMessageIndex(0);
    loadServices();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: 'background.default',
        ...containerSx,
      }}
    >
      {backgroundAnimations}

      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <AnimateLogoZoom logo={logo} />
        <AnimatePresence mode="wait">
          <m.div
            key={hasFailed ? 'failed' : messageIndex}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ marginTop: 32 }}
          >
            <Typography variant="h6" sx={{ color: 'text.primary' }} component="div">
              {(hasFailed ? failedText : messages[messageIndex] || '').split(' ').map((word, i) => (
                <m.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                  {word}
                </m.span>
              ))}
            </Typography>
          </m.div>
        </AnimatePresence>
        
        {hasFailed && (
          <Box sx={{ display: 'flex', gap: 2, mt: 3, p: 2, justifyContent: 'center' }}>
            <LiquidButton 
              onClick={handleRetry}
              variant="liquid"
              size="small"
              enableRipple
              liquidSpeed={1.5}
              sx={{ px: 2, py: 1, borderRadius: '12px' }}
            >
              {retryText}
            </LiquidButton>
            {onLogout && (
              <Button 
                onClick={onLogout}
                variant="outlined"
                size="small"
                sx={{ 
                  px: 2, 
                  py: 1, 
                  borderRadius: '12px',
                  borderColor: 'primary.main',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                  }
                }}
              >
                {logoutText}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
