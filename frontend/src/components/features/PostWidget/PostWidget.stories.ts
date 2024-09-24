import type { Meta, StoryObj } from '@storybook/react';

import PostWidget from './index';

const meta: Meta<typeof PostWidget> = {
    title: 'Pobedit/PostWidget',
    component: PostWidget,
};

export default meta;

type Story = StoryObj<typeof PostWidget>;

export const Default: Story = {
    args: {
        postId: 1,
        peerId: 2,
        date: new Date("3.3.2024"),
        message: "Some a very short text"
    }
};
