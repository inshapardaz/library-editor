import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// UI Library Import
import { Button, Card, Center, Container, Grid, Group, LoadingOverlay, SimpleGrid, Switch, Textarea, TextInput, useMantineTheme } from "@mantine/core";

// Local Impoprt
import PageHeader from "@/components/pageHeader";
import IconNames from '@/components/iconNames';
import { IconLibrary } from '@/components/icons';
import { isEmail, isNotEmpty, useForm } from "@mantine/form";

import {
    useAddLibraryMutation,
    useUpdateLibraryImageMutation,
    useUpdateLibraryMutation,
    useGetLibraryQuery
} from "@/store/slices/libraries.api";
import ImageUpload from '@/components/imageUpload';
import Error from '@/components/error';
import LanguageSelect from '@/components/languageSelect';
import FilestoreTypeSelect from '@/components/filestoreTypeSelect';
import { error, success } from '@/utils/notifications';
//---------------------------------------
const LibraryEditPage = () => {
    const { libraryId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const [loaded, setLoaded] = useState(false);
    const [image, setImage] = useState(null);
    const isEditing = useMemo(() => libraryId != null, [libraryId]);

    const [add, { isLoading: isAdding }] = useAddLibraryMutation();
    const [update, { isLoading: isUpdating }] = useUpdateLibraryMutation();
    const [updateImage, { isLoading: isUpdatingImage }] = useUpdateLibraryImageMutation();
    const { data: library, refetch, error: errorLoading, isFetching } = useGetLibraryQuery({ libraryId }, { skip: !libraryId });

    // ------------------------- Form --------------------------------
    const form = useForm({
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        initialValues: {
            name: '',
            description: '',
            language: '',
            ownerEmail: '',
            supportsPeriodicals: false,
            public: false,
            fileStoreType: '',
            fileStoreSource: '',
        },

        validate: {
            name: isNotEmpty(t("library.name.required")),
            ownerEmail: (value) => isNotEmpty('library.email.required')(value) && isEmail(t("library.email.error"))(value),
            language: isNotEmpty(t("library.language.required")),
            fileStoreType: isNotEmpty(t("book.language.required")),
            fileStoreSource: isNotEmpty(t("book.language.required")),
        }
    });

    //----------------------------------------------------------------------

    useEffect(() => {

        if (!loaded && library != null) {
            if (!library?.links?.update) {
                navigate('/403')
            } else {
                form.initialize(library);
                setLoaded(true);
            }
        }
    }, [form, library, loaded, navigate]);

    const onSubmit = async (_library) => {
        if (isEditing) {
            try {
                const response = await update({ libraryId, payload: _library })
                    .unwrap();
                await uploadImage(response);
                success({ message: t("library.actions.edit.success") })

                navigate(`/libraries/${libraryId}`)
            }
            catch (e) {
                console.error(e)
                error({ message: t("library.actions.edit.error") })
            }
        } else {
            try {
                const response = await add({ libraryId, payload: _library })
                    .unwrap();

                await uploadImage(response)
                success({ message: t("library.actions.add.success") });
                navigate(`/libraries/${response.id}`);
            }
            catch (e) {
                console.error(e);
                error({ message: t("library.actions.add.error") });
            }
        }
    };

    const uploadImage = async (_library) => {
        if (image) {
            await updateImage({ library: _library, payload: image }).unwrap();
        }
    };

    //-------------------------- Render -------------------------------

    const icon = <Center h={450}><IconLibrary width={250} style={{ color: theme.colors.dark[1] }} /></Center>;

    if (errorLoading) {
        return (<Container fluid mt="sm">
            <Error title={t('library.error.loading.title')}
                detail={t('library.error.loading.detail')}
                onRetry={refetch} />
        </Container>)
    };

    return (<>
        <Container fluid mt="sm">
            <PageHeader
                title={library ? t('library.actions.edit.title', { title: library?.name }) : t('library.actions.add.title')}
                defaultIcon={IconNames.Library} />
            <LoadingOverlay visible={isFetching || isAdding || isUpdating || isUpdatingImage} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Grid
                mih={50}
            >
                <Grid.Col span="content">
                    <ImageUpload
                        t={t}
                        src={library?.links?.image}
                        alt={library?.title}
                        fallback={icon}
                        onChange={setImage}
                    />
                </Grid.Col>
                <Grid.Col span="auto" >
                    <Card withBorder >
                        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                            <SimpleGrid >
                                <TextInput key={form.key('ownerEmail')} disabled={isEditing}
                                    label={t("library.email.label")}
                                    placeholder={t("library.email.placeholder")}
                                    {...form.getInputProps('ownerEmail')}
                                />

                                <TextInput key={form.key('name')}
                                    label={t("library.name.label")}
                                    placeholder={t("library.name.placeholder")}
                                    {...form.getInputProps('name')}
                                />

                                <Textarea key={form.key('description')}
                                    label={t("library.description.label")}
                                    placeholder={t("library.description.placeholder")}
                                    {...form.getInputProps('description')} />


                                <LanguageSelect key={form.key('language')}
                                    label={t("library.language.label")}
                                    {...form.getInputProps('language')}
                                />

                                <Switch
                                    label={t("library.supportsPeriodicals.label")}
                                    key={form.key('supportsPeriodicals')}
                                    {...form.getInputProps('supportsPeriodicals', { type: 'checkbox' })}
                                />

                                <Switch
                                    label={t("library.public.label")}
                                    key={form.key('public')}
                                    {...form.getInputProps('public', { type: 'checkbox' })}
                                />

                                <FilestoreTypeSelect key={form.key('fileStoreType')}
                                    label={t("library.fileStoreType.label")}
                                    {...form.getInputProps('fileStoreType')}
                                />

                                <TextInput key={form.key('fileStoreSource')} dir="ltr"
                                    label={t("library.fileStoreSource.label")}
                                    placeholder={t("library.fileStoreSource.placeholder")}
                                    {...form.getInputProps('fileStoreSource')}
                                />
                            </SimpleGrid>

                            <Group justify="flex-end" mt="md">
                                <Button type="submit">{t('actions.save')}</Button>
                                <Button variant='light' onClick={() => navigate(-1)}>{t('actions.cancel')}</Button>
                            </Group>
                        </form>
                    </Card>
                </Grid.Col>
            </Grid>
        </Container >
    </>
    )
}

export default LibraryEditPage;