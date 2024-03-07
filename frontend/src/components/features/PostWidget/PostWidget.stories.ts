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
        Id: 1,
        PeerId: 2,
        MessageDate: new Date(),
        Message: "Some a very short text"
    }
};
