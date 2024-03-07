import type { Meta, StoryObj } from '@storybook/react';

import Badge from './Badge';

const meta: Meta<typeof Badge> = {
    title: 'Pobedit/Badge',
    component: Badge,
};

export default meta;

type Story = StoryObj<Badge>;

export const Active: Story = {
    args: {
        title: 'Users',
        active: true
    }
};

export const NotActive: Story = {
    args: {
        title: 'Users',
        active: false
    }
};
