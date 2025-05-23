import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute, ProtectedRouteAdmin } from './components/UI/ProtectedRoute/ProtectedRoute';
import { useAppSelector } from './store/store';
import { MainPage } from './containers/pages/MainPage';
import { AboutThePlatform } from './components/HomePageComponents/AboutThePlatform/AboutThePlatform';
import { Layout } from './components/UI/Layout/Layout';
import LoginForm from './components/Form/LoginForm/LoginForm';
import RegistrationForm from './components/Form/RegistrationForm/RegistrationForm';
import { DealList } from './components/DealList/DealList';
import { useCheckAuthUserQuery } from './store/api/user.api';
import { Profile } from './components/Profile/Profile';
import { DealHistory } from './components/DealHistory/DealHistory';
import { Notifications } from './components/Notifications/Notifications';
import { CabinetLayout } from './components/UI/CabinetLayout/CabinetLayout';
import { Security } from './components/Security/Security';
import { PanelLayout } from './components/UI/PanelLayout/PanelLayout';
import { Profiles } from './components/AdminControls/Profiles/Profiles';
import { DataEdit } from './components/AdminControls/DataEdit/DataEdit';
import { DocsConfirmations } from './components/AdminControls/DocsConfirmations/DocsConfirmations';
import { GlobalNotifications } from './components/AdminControls/GlobalNotifications/GlobalNotifications';
import { Questions } from './components/AdminControls/Questions/Questions';
import { Blocks } from './components/AdminControls/Blocks/Blocks';
import { AdminPrivateNotification } from './components/AdminControls/PrivateNotification/PrivateNotification';
import { Chat } from './components/Chat/Chat';
import { DealChat } from './components/Chat/components/DealChat/DealChat';
import { ChangePassword } from './components/Security/ChangePassword/ChangePassword';
import { RecoverPassword } from './components/Security/RecoverPassword/RecoverPassword';
import { Ratings } from './components/Ratings/Ratings';
import { LawyerDetail } from './components/Ratings/LawyerDetail/LawyerDetail';
import { DealLawyers } from './components/DealHistory/DealLawyers';
import { LawyerList } from './components/LawyersList/LawyerList';
import { IntellectualRobot } from './components/IntellectualRobot/IntellectualRobot';
import { FaqPage } from './components/FaqPage/FaqPage';
import { Todo } from './components/Todo/Todo';
import { NotFound } from './components/NotFound/NotFound';
import { Payment } from './components/Payment/Payment';
import './App.scss';


function App() {
    const { user, lawyer } = useAppSelector(state => state.users);
    const { data: userData, isLoading } = useCheckAuthUserQuery();
    useEffect(() => {
        if (userData) {
            console.log('User data from refresh:', userData);
            return;
        }
    }, [userData]);

    return (
        <div>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<MainPage />} />
                    <Route path="/about" element={<AboutThePlatform />} />
                    <Route path="/notifications" element={
                        <ProtectedRoute client={user || lawyer} loading={isLoading}>
                            <Notifications />
                        </ProtectedRoute>} />
                    <Route path="/chat" element={
                        <ProtectedRoute client={user || lawyer} loading={isLoading}>
                            <Chat />
                        </ProtectedRoute>}>
                        <Route path="/chat/:id" element={<DealChat />} />
                    </Route>
                    <Route path="/dealList" element={
                        <ProtectedRoute client={lawyer} loading={isLoading}>
                            <DealList />
                        </ProtectedRoute>} />
                    <Route path="/todo" element={
                        <ProtectedRoute client={user || lawyer} loading={isLoading}>
                            <Todo />
                        </ProtectedRoute>} />
                    <Route path="/lawyer_detail/:id" element={<LawyerDetail />} />
                    <Route path="/dealList/lawyers" element={
                        <ProtectedRoute client={user || lawyer} loading={isLoading}>
                            <DealLawyers />
                        </ProtectedRoute>} />
                    <Route path="/lawyer_list" element={<LawyerList />} />
                    <Route path="/intellectual-robot" element={<IntellectualRobot />} />
                    <Route path="/faq" element={<FaqPage />} />
                </Route>
                <Route path="/cabinet" element={
                    <ProtectedRoute client={user || lawyer} loading={isLoading}>
                        <CabinetLayout />
                    </ProtectedRoute>}>
                    <Route index path="/cabinet/profile" element={<Profile />} />
                    <Route path="/cabinet/dealHistory" element={<DealHistory />} />
                    <Route path="/cabinet/security" element={<Security />} />
                    <Route path="/cabinet/notifications" element={<Notifications />} />
                    <Route path="/cabinet/ratings" element={<Ratings />} />
                    <Route path="/cabinet/payment" element={<Payment />} />
                    <Route path="/cabinet/change-password" element={<ChangePassword />} />
                    <Route path="/cabinet/recover-password" element={<RecoverPassword />} />
                </Route>
                <Route path="/adminPanel" element={
                    <ProtectedRouteAdmin client={user || lawyer} loading={isLoading}>
                        <PanelLayout />
                    </ProtectedRouteAdmin>}>
                    <Route index path="/adminPanel/profiles" element={<Profiles />} />
                    <Route path="/adminPanel/data" element={<DataEdit />} />
                    <Route path="/adminPanel/docs" element={<DocsConfirmations />} />
                    <Route path="/adminPanel/notifications" element={<GlobalNotifications />} />
                    <Route path="/adminPanel/questions" element={<Questions />} />
                    <Route path="/adminPanel/blocks" element={<Blocks />} />
                    <Route path="/adminPanel/privateNotifications" element={<AdminPrivateNotification />} />
                </Route>
                <Route path="/registration" element={<RegistrationForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;