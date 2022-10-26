// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayerHost, PrimaryButton, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
import { embededIframeStyles } from './styles/Book.styles';
import { Header } from './Header';
import './styles/Common.css';
import { fetchConfig } from './utils/FetchConfig';
import { AppConfigModel } from './models/ConfigModel';
import { GenericError } from './components/GenericError';
import { useEffect, useState } from 'react';

const PARENT_ID = 'BookMeetingSection';

export const Book = (): JSX.Element => {
  const [config, setConfig] = useState<AppConfigModel | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const fetchedConfig = await fetchConfig();
        setConfig(fetchedConfig);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  if (config) {
    const bookingsLink = config.microsoftBookingsUrl;
    console.log(bookingsLink);

    const onSetBookingsLink = async () => {
      const response = await fetch('/api/config', {
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        method: 'POST'
      });

      const responseContent = await response.text();
      const config = JSON.parse(responseContent);
      setConfig(config);
    };

    const onUnsetBookingsLink = async () => {
      const response = await fetch('/api/config/restore', {
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        method: 'POST'
      });

      const responseContent = await response.text();
      const config = JSON.parse(responseContent);
      setConfig(config);
    };

    return (
      <ThemeProvider theme={config.theme} style={{ height: '100%' }}>
        <Stack styles={backgroundStyles(config.theme)}>
          <Header companyName={config.companyName} parentid={PARENT_ID} />
          <LayerHost
            id={PARENT_ID}
            style={{
              position: 'relative',
              height: '100%'
            }}
          >
            <Stack style={{ marginTop: '12px', width: '500px' }}>
              <PrimaryButton style={{ marginTop: '8px', marginBottom: '8px' }} onClick={onSetBookingsLink}>
                Set New Bookings Link In Cache
              </PrimaryButton>
              <PrimaryButton onClick={onUnsetBookingsLink}>Restore Bookings Link</PrimaryButton>
            </Stack>
            <iframe src={bookingsLink} scrolling="yes" style={embededIframeStyles}></iframe>
          </LayerHost>
        </Stack>
      </ThemeProvider>
    );
  }

  if (error) {
    return <GenericError statusCode={error.statusCode} />;
  }

  return <Spinner styles={fullSizeStyles} />;
};
