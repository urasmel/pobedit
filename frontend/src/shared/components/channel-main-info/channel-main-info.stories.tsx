import type { Meta, StoryObj } from '@storybook/react';
import { ChannelMainInfo } from './channel-main-info';
import { MemoryRouter } from 'react-router-dom';

const meta = {
    title: 'Pobedit/ChannelMainInfo',
    component: ChannelMainInfo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
    },
} satisfies Meta<typeof ChannelMainInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <MemoryRouter>
            <ChannelMainInfo {...args} />
        </MemoryRouter>
    ),
    args: {
        id: 21745,
        title: 'Пример канала',
    },
}; 
