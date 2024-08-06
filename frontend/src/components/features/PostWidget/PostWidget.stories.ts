import type { Meta, StoryObj } from '@storybook/react';

import PostWidget from './PostWidget';

const meta: Meta<typeof PostWidget> = {
    title: 'Pobedit/PostWidget',
    component: PostWidget,
};

export default meta;

type Story = StoryObj<PostWidget>;

export const Default: Story = {
    args: {
        id: 1,
        peerId: 2,
        date: new Date("3.3.2024"),
        message: "Some a very short text"
    }
};
