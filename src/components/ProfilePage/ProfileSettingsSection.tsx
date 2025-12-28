import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@store";

import Toogle from "@components/UI/Toogle";
import { languageList, uiSettingsAction } from "@contents/profileContent";
import {
  updateIsDarkMode,
  updateIsShownActivityStatus,
  updateIsShownAvatar,
  updateIsShownDescriotion,
  updateIsShownPhoneNumber,
  updateLanguage,
  updatetIsShownOriginalText,
} from "@store/userActions";
import ThemeToogle from "@components/UI/ThemeToogle";

const ProfileSettingsSection = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { profile: _, ...uiSettings } = useSelector(
    (state: RootState) => state.user
  );
  const lang =
    useSelector((state: RootState) => state.user?.profile?.language) ?? "en";
  const appDispatch = useDispatch<AppDispatch>();

  return (
    <section className="chatapp-settings-section">
      <p>{uiSettingsAction.activityStatus[lang]}</p>
      <Toogle
        checked={!uiSettings?.isShownActivityStatus}
        onChange={() => appDispatch(updateIsShownActivityStatus())}
      />
      <p>{uiSettingsAction.phoneNumber[lang]}</p>
      <Toogle
        checked={!uiSettings?.isShownPhoneNumber}
        onChange={() => appDispatch(updateIsShownPhoneNumber())}
      />
      <p>{uiSettingsAction.description[lang]}</p>
      <Toogle
        checked={!uiSettings?.isShownDescription}
        onChange={() => appDispatch(updateIsShownDescriotion())}
      />

      <p>{uiSettingsAction.avatar[lang]}</p>
      <Toogle
        checked={!uiSettings?.isShownAvatar}
        onChange={() => appDispatch(updateIsShownAvatar())}
      />
      <p>{uiSettingsAction.originalText[lang]}</p>
      <Toogle
        checked={!uiSettings?.isShownOriginalText}
        onChange={() => appDispatch(updatetIsShownOriginalText())}
      />

      <p>{uiSettingsAction.language[lang]}</p>
      <select
        className="select select-accent"
        value={lang}
        onChange={(e) =>
          appDispatch(updateLanguage({ lang: e.currentTarget.value }))
        }
      >
        {languageList[lang].map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
      <p>{uiSettingsAction.darkMode[lang]}</p>
      <ThemeToogle
        checked={!uiSettings?.isDarkMode}
        onChange={() => appDispatch(updateIsDarkMode())}
        theme="light"
      />
    </section>
  );
};

export default ProfileSettingsSection;
