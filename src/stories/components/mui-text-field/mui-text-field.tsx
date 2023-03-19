import type {TextFieldProps} from '@mui/material';
import {TextField} from '@mui/material';
import type {FC} from 'react';
import {Fragment} from 'react';
import {InputRenderer} from '../../../components/input-renderer/input-renderer';
import type {TPlugin} from '../../../defines/common.types';
import {getMUIColor} from '../../utils/get-mui-color/get-mui-color';

// TODO: FIX TYPES SO PROPS CAN BE PROPERLY EXTENDED
// TODO: PROPERLY TYPE VALIDATORS SO THAT PASSED DATA CONTAINS TYPES (PARAMS, DATA...)
// TODO: IMPLEMENT defaultValue
// TODO: PASS RESOLVED mandatory IN RENDERER SECOND ARGUMENT. WHAT OTHER PROPERTIES TO PASS-THROUGH FOR COMMODITY?
// TODO: RENAME mandatory TO required
// TODO: RENAME inputProps TO bind (MAKE SURE IT ONLY CONTAINS MINIMUM SET OF PROPS TO WORK)
// TODO: RENAME inputRendererAPI TO api
// TODO: RENAME inputRenderFn TO render
// TODO: RENAME errorMessages TO errors
// TODO: START MIGRATION BY CREATING useInput HOOK. THEN MAKE InputRenderer USE IT INTERNALLY (ONLY AS SYNTAX ALTERNATIVE)

// TODO: TO OPTIMIZE CROSS-INPUT OPERATIONS, TRACK INPUT DEPENDENCIES AND ONLY TRIGGER MINIMUM STATE CHANGES
// TODO: FOR INITIAL FORM VALIDATION, MAKE FORM VALIDATE AFTER FORM MOUNT AND NOT AFTER INPUT MOUNT

// TODO: FOR FORM LEVEL DATA LIKE PAYLOAD AND VALIDATION STATUS, EXPOSE IT THROUGH HOOKS WITH THEIR OWN STATE INSIDE. SO STATE UPDATE WILL BE RESERVED FOR "SUBSCRIBERS" ONLY
// TODO: IN ORDER TO DO THE ABOVE, EACH ADDITIONAL HOOK MUST REGISTER AT MOUNT JUST LIKE INPUT'S

// TODO: PROVIDE GRANULAR ACCESS TO DATA WITH MULTIPLE HOOKS

// TODO: ADD DESCRIPTIONS LIKE MUI DOES

interface IMuiTextFieldProps {
    name: string;
    errorMessages: {
        mandatory?: string | null;
        match?: string | null;
    };
    plugins: TPlugin;
}

const MuiTextField: FC<
    IMuiTextFieldProps & Omit<TextFieldProps, 'error' | 'color'>
> = ({name, errorMessages, plugins, required, ...rest}) => {
    return (
        <InputRenderer
            name={name}
            errorMessages={errorMessages}
            mandatory={required}
            plugins={plugins}
            inputRenderFn={(inputProps, {status, validationObject}) => {
                const color = getMUIColor(status);

                return (
                    <TextField
                        {...rest}
                        {...inputProps}
                        required={required}
                        error={status === 'invalid'}
                        color={color}
                        helperText={validationObject.messages.map((msg, i) => {
                            return (
                                <Fragment key={i}>
                                    <span>{msg.message}</span>
                                    <br />
                                </Fragment>
                            );
                        })}
                    />
                );
            }}
        />
    );
};

export type {IMuiTextFieldProps};
export {MuiTextField};
