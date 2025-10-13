import type { Meta, StoryObj } from '@storybook/react';

import { LoadingProgressDialog } from './loading-progress-dialog';

const meta = {
    title: 'Pobedit/LoadingProgressDialog',
    component: LoadingProgressDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
    },
} satisfies Meta<typeof LoadingProgressDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
    render: (args) => (
        <LoadingProgressDialog {...args} />
    ),
    args: {
        open: true,
        date: new Date().toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }),
        cancellLoading: () => { }
    },
}; 
