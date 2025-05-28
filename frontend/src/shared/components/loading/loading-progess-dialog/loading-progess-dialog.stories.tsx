import type { Meta, StoryObj } from '@storybook/react';

import { LoadingProgessDialog } from './loading-progess-dialog';

const meta = {
    title: 'Pobedit/LoadingProgessDialog',
    component: LoadingProgessDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
    },
} satisfies Meta<typeof LoadingProgessDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
    render: (args) => (
        <LoadingProgessDialog {...args} />
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
