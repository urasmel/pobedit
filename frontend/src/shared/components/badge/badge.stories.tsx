import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { Badge } from './badge';

const meta = {
    title: 'Pobedit/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        link: { control: 'color' },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <MemoryRouter>
            <Badge {...args} />
        </MemoryRouter>
    ),
    args: {
        children: 'Badge with MemoryRouter',
        link: '/home',
    },
}; 
