import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";

// Survey.js
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';

const Individual = ({
    application_form,
    selectedIndex,
    viewingStudentName
}) => {
    const [surveyModel, setSurveyModel] = useState(null);
    const [groupedResponses, setGroupedResponses] = useState({});
    const [maxId, setMaxId] = useState(0);
    const [selectedUserName, setSelectedUserName] = useState("");
    const [responses, setResponses] = useState({ usernames: "", id: "", writeforms: [] });
    const [idNumber, setIdNumber] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let userIdCounter = 1;
        if (application_form[selectedIndex]?.user_name) {
            const grouped = application_form[selectedIndex].user_name.reduce((acc, user) => {
                const userKey = user.user_name;
                if (!acc[userKey]) {
                    acc[userKey] = {
                        usernames: user.user_name,
                        write_forms: [],
                        id: userIdCounter,
                    };
                    userIdCounter++;
                }

                acc[userKey].write_forms.push(...user.write_form);

                return acc;
            }, {});

            setGroupedResponses(grouped);

            const MaxId = Math.max(...Object.values(grouped).map(user => user.id));
            setMaxId(MaxId);

            //もしもSummary→Individualの流れであれば
            //呼び出していた名前をsetSelectedUserNameに入れる
            const firstUsername = viewingStudentName || Object.keys(grouped)[0];
            if (firstUsername) {
                console.log("firstUsername",firstUsername);
                setSelectedUserName(firstUsername);
                const initialId = grouped[firstUsername].id || 1;
                setIdNumber(initialId);
                setResponses({
                    usernames: grouped[firstUsername].usernames,
                    writeforms: grouped[firstUsername]?.write_forms,
                    id: initialId,
                });
            }

            setLoading(false); // データが読み込まれたらローディング状態を解除
        }
    }, [application_form, selectedIndex]);

    const handleUserNameChange = (event) => {
        const UserName = event.target.value;
        setSelectedUserName(UserName);
        const newId = groupedResponses[UserName]?.id ? Number(groupedResponses[UserName].id) : "";
        setResponses({
            usernames: UserName,
            writeforms: groupedResponses[UserName].write_forms || [],
            id: newId,
        });
        setIdNumber(newId);

        console.log(groupedResponses[UserName]);
        console.log("newId",newId);
        console.log("usernames",UserName);
        console.log("write_form",groupedResponses[UserName].write_forms);
        };

    const handleIdChange = (event) => {
        const newId = event.target.value;

        if (newId === "") {
            setIdNumber("");
            return;
        }

        const numericId = Number(newId);
        if (!isNaN(numericId)) {
            setIdNumber(numericId);

            const matchedUserName = Object.keys(groupedResponses).find(
                (usernames) => Number(groupedResponses[usernames].id) === numericId
            );

            if (matchedUserName) {
                setSelectedUserName(matchedUserName);
                setResponses({
                    usernames: groupedResponses[matchedUserName].usernames || "",
                    writeforms: groupedResponses[matchedUserName].write_forms || [],
                    id: numericId,
                });
            }
        }
    };

    const handleCountUp = () => {
        setIdNumber((prev) => {
            const newId = prev + 1;
            if (newId <= maxId) {
                handleIdChange({ target: { value: newId } });
                return newId;
            }
            return prev;
        });
    };

    const handleCountDown = () => {
        setIdNumber((prev) => {
            const newId = Math.max(prev - 1, 1);
            handleIdChange({ target: { value: newId } });
            return newId;
        });
    };

    useEffect(() => {
        const css =
            `.sv-action__content .sd-btn--action.sd-navigation__complete-btn {
            display: none;
          }`;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }, []);

    useEffect(() => {
        if (!loading && Array.isArray(responses.writeforms) && responses.writeforms.length > 0) {
            // transformFormFieldsの処理をuseEffect内で行う
            console.log("responses.writeforms",responses.writeforms);
                const surveyData = {
                title: selectedUserName,
                pages: [
                    {
                        name: "page1",
                        elements: responses.writeforms.map(field => ({
                            type: field.type || "text",
                            name: field.name || "default_name",
                            title: field.title || "無題の質問",
                            ...(field.validators && { validators: field.validators }),
                            ...(field.inputType && { inputType: field.inputType }),
                            ...(field.choices && { choices: field.choices }),
                            ...(field.response && { defaultValue: field.response }),
                            readOnly: true,
                        })),
                    },
                ],
            };

            const survey = new Model(surveyData);
            setSurveyModel(survey); // モデルの状態を更新
        }
    }, [loading, responses.writeforms, selectedUserName]);

    return (
        <>
            {loading ? ( // ローディング中はサーベイを表示しない
                <div>Loading...</div>
            ) : (
                <>
                    <Select value={selectedUserName} onChange={handleUserNameChange} displayEmpty className="title-dropdown">
                        {Object.keys(groupedResponses).map((user_name, index) => (
                            <MenuItem key={index} value={user_name}>
                                {user_name}
                            </MenuItem>
                        ))}
                    </Select>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <ArrowBackIosNewIcon onClick={handleCountDown} />

                        <TextField
                            id="standard-number"
                            type="number"
                            value={idNumber}
                            onChange={handleIdChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: 1,
                                max: maxId,
                            }}
                            sx={{
                                width: '40px',
                            }}
                        /> / {maxId} 名の回答

                        <ArrowForwardIosIcon onClick={handleCountUp} />

                    </Stack>

                    {surveyModel && (
                        <Box>
                            <Survey model={surveyModel} />
                        </Box>
                    )}
                </>
            )}
        </>
    );
}

Individual.propTypes = {
    application_form: PropTypes.arrayOf(
        PropTypes.shape({
            article_title: PropTypes.string.isRequired,
            user_name: PropTypes.arrayOf(
                PropTypes.shape({
                    news_created_at: PropTypes.string.isRequired,
                    user_name: PropTypes.string.isRequired,
                    write_form: PropTypes.arrayOf(
                        PropTypes.shape({
                            id: PropTypes.string.isRequired,
                            name: PropTypes.string.isRequired,
                            title: PropTypes.string.isRequired,
                            type: PropTypes.string.isRequired,
                            inputType: PropTypes.string,
                            choices: PropTypes.array,
                            maxLength: PropTypes.number,
                        })
                    ).isRequired,
                    write_form_id: PropTypes.number.isRequired,
                    id: PropTypes.string.isRequired,
                })
            ).isRequired,
        })
    ).isRequired,
    selectedIndex: PropTypes.number.isRequired,
    viewingStudentName: PropTypes.string,
};

export default Individual;
