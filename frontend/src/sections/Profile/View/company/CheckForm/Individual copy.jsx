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

// Individual.jsx
const Individual = ({
    application_form,
    selectedIndex,
}) => {
    console.log("application_form", application_form);
    console.log("selectedIndex", selectedIndex);
    const [surveyModel, setSurveyModel] = useState(null);
    const [groupedResponses, setGroupedResponses] = useState({});
    const [maxId, setMaxId] = useState(0);
    const [selectedUserName, setSelectedUserName] = useState("");
    const [responses, setResponses] = useState({ responses: [], username: "", id: "" });
    const [idNumber, setIdNumber] = useState("");

    useEffect(() => {
        if (application_form[selectedIndex]?.user_name) {
            const grouped = application_form[selectedIndex].user_name.reduce((acc, user) => {
                user.write_form.forEach((response, index) => {  // index を使用
                    const userKey = user.user_name;
    
                    if (!acc[userKey]) {
                        acc[userKey] = {
                            username: user.user_name,
                            news_created_at: user.news_created_at,
                            write_form: [],
                            responses: [],
                            id:index + 1
                        };
                    }
    
                    acc[userKey].write_form.push(response);
                    acc[userKey].responses.push(response.response);
                    });
                return acc;
            }, {});
    
            setGroupedResponses(grouped);
    
            const MaxId = Math.max(Object.values(grouped).map(user => Math.max(user.id)));
            setMaxId(MaxId);
            console.log("idの最大値", MaxId);
    
            const firstUsername = Object.keys(grouped)[0];
            if (firstUsername) {
                setSelectedUserName(firstUsername);
                const initialId = grouped[firstUsername].id[0] || 1; // 最初のidを設定
                setResponses({
                    responses: grouped[firstUsername].responses,
                    username: grouped[firstUsername].username,
                    id: initialId,
                });
                setIdNumber(initialId);
            }
        }
    }, [application_form, selectedIndex]);

    const handleUserNameChange = (event) => {
        const title = event.target.value;
        setSelectedUserName(title);
        const newId = groupedResponses[title]?.write_form[0]?.id ? Number(groupedResponses[title].write_form[0].id) : "";
        setResponses({
            responses: groupedResponses[title]?.responses || [],
            username: groupedResponses[title]?.username || "",
            id: groupedResponses[title]?.write_form[0]?.id || "",
        });
        setIdNumber(newId);
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

            const matchedTitle = Object.keys(groupedResponses).find(
                (title) => Number(groupedResponses[title].write_form[0].id) === numericId
            );

            if (matchedTitle) {
                setSelectedUserName(matchedTitle);
                setResponses({
                    responses: groupedResponses[matchedTitle].responses || [],
                    username: groupedResponses[matchedTitle].username || "",
                    id: groupedResponses[matchedTitle].write_form[0]?.id || "",
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

    const transformFormFields = (fields, user_name) => {
        if (!Array.isArray(fields) || fields.length === 0) {
            console.error("フォームフィールドがありません。fields:", fields);
            return {
                title: user_name,
                pages: [],
            };
        }

        return {
            title: user_name,
            pages: [
                {
                    name: "page1",
                    elements: fields.map(field => ({
                        type: field.type || "text",
                        name: field.name || "default_name",
                        title: field.title || "無題の質問",
                        ...(field.validators && { validators: field.validators }),
                        ...(field.inputType && { inputType: field.inputType }),
                        ...(field.choices && { choices: field.choices }), 
                        ...(field.response && { defaultValue: field.response }), // ユーザーの選択肢をデフォルト値として設定
                        readOnly: true,
                    })),
                },
            ],
        };
    };

    const surveyData = transformFormFields(
        groupedResponses[selectedUserName]?.write_form || [],
        selectedUserName
    );

    console.log("write_form",groupedResponses[selectedUserName]?.write_form);
    console.log("selectedUserName",selectedUserName);
    console.log("groupedResponses", groupedResponses);


    const survey = new Model(surveyData);

    useEffect(() => {
        setSurveyModel(survey);
    }, []);

    console.log("レスポンスの内容",groupedResponses);

    return (
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
                /> / {maxId}個の質問

                <ArrowForwardIosIcon onClick={handleCountUp} />

                {responses &&(
                    <>
                        {responses.news_created_at}
                    </>
                )}

            </Stack>

            {surveyModel &&
                <Box>
                    <Survey model={surveyModel} />
                </Box>
            }
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
};

export default Individual;
