import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { NumberInputProps } from './number-input-props';
import { Slider } from '@mui/material';



export default function CustomizedSlider(props: NumberInputProps) {

    const handleChange = (_: Event, newValue: number) => {
        props.onChange(newValue);
    };

    return (
        <Box sx={{ width: 250 }}>
            <Typography id={props.id}
                variant="body2" gutterBottom>
                {props.caption}
            </Typography>
            <Slider
                value={props.value}
                min={props.min}
                step={1}
                max={props.max}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby={props.id}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="body2"
                    onClick={() => props.onChange(props.min)}
                    sx={{ cursor: 'pointer' }}
                >
                    {props.min} min
                </Typography>
                <Typography
                    variant="body2"
                    onClick={() => props.onChange(props.max)}
                    sx={{ cursor: 'pointer' }}
                >
                    {props.max} max
                </Typography>
            </Box>
        </Box>
    );
}
