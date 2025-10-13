export interface NumberInputProps {
    caption: string;
    value: number;
    min: number;
    max: number;
    id: string;
    onChange: (value: number) => void;
    disabled: boolean;
}
