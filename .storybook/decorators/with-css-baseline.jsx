import {CssBaseline} from '@mui/material';

const withCssBaseline = (Story) => {
    return (
        <>
            <CssBaseline />
            <Story />
        </>
    );
};

export {withCssBaseline};
