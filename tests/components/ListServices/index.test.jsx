import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListServices from 'components/ListServices';
import {
  getServices,
  getFilteredServices,
  getTotalForAllServices,
  getTotalForMyServices,
} from 'components/ListServices/utils';
import { useRouter } from 'next/router';
import { getServiceContract } from 'common-util/Contracts';
import { wrapProvider, ACTIVE_TAB, getTableTd } from '../../helpers';

// mocks for router & smart-contract functions
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('components/ListServices/utils', () => ({
  getServices: jest.fn(),
  getFilteredServices: jest.fn(),
  getTotalForAllServices: jest.fn(),
  getTotalForMyServices: jest.fn(),
}));

jest.mock('common-util/Contracts', () => ({
  getServiceContract: jest.fn(),
  getServiceManagerContract: jest.fn(),
}));

const SERVICE_1 = { name: 'Service One' };

getServiceContract.mockImplementation(() => ({
  methods: {
    getService: jest.fn(() => ({
      call: jest.fn(() => Promise.resolve(SERVICE_1)),
    })),
  },
}));

useRouter.mockImplementation(() => ({ push: jest.fn() }));

// dummy responses mock
const allServiceResponse = { id: '1', state: '5' };
const myServiceResponse = { id: '2' };

describe('listServices/index.jsx', () => {
  getServices.mockImplementation(() => Promise.resolve([allServiceResponse]));
  getFilteredServices.mockImplementation(() => Promise.resolve([myServiceResponse]));
  getTotalForAllServices.mockImplementation(() => Promise.resolve(1));
  getTotalForMyServices.mockImplementation(() => Promise.resolve(1));

  it('should render tabs with `All Tab` as active tab & Mint button', async () => {
    expect.hasAssertions();

    const { container, getByRole } = render(wrapProvider(<ListServices />));
    // check if the selected tab is `All` & has the correct content
    await waitFor(async () => {
      expect(container.querySelector(ACTIVE_TAB).textContent).toBe('All');
    });

    // ckecking Id, description column
    expect(container.querySelector(getTableTd(1)).textContent).toBe('1');
    expect(container.querySelector(getTableTd(3)).textContent).toBe(
      'Terminated Bonded',
    );

    // Mint button
    expect(getByRole('button', { name: 'Mint' })).toBeInTheDocument();
  });

  it('should render tabs with `All Services` as active tab & Mint button', async () => {
    expect.hasAssertions();
    const { container, getByRole } = render(wrapProvider(<ListServices />));

    // click the `My services` tab
    userEvent.click(container.querySelector('.ant-tabs-tab:nth-child(2)'));

    // check if the selected tab is `My services` & has the correct content
    await waitFor(async () => expect(container.querySelector(ACTIVE_TAB).textContent).toBe(
      'My Services',
    ));

    // Mint button
    expect(getByRole('button', { name: 'Mint' })).toBeInTheDocument();
  });
});
