import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// UI Library Imports
import { useForm, isNotEmpty, isInRange } from '@mantine/form';
import { TextInput, Textarea, Switch, NumberInput, Flex, Group, Button, SimpleGrid } from '@mantine/core';

// Local imports
import { BookStatus, Copyrights } from '@/models';
import AuthorsSelect from '@/components/authors/authorsSelect';
import CategoriesSelect from '@/components/categories/categoriesSelect';
import CopyrightSelect from '@/components/copyrightSelect';
import LanguageSelect from '@/components/languageSelect';
import PublishStatusSelect from '@/components/publishStatusSelect';
import SeriesSelect from '@/components/series/seriesSelect';
import If from '@/components/if';
import PublisherAutocomplete from './publisherSelect';

//---------------------------------

const BookForm = ({ libraryId,
    book = null,
    cols = 1,
    showCancel = true,
    showOk = true,
    validateOnLoad = false,
    onSubmit,
    onCancel,
    onValuesChange = () => { }
}) => {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            title: '',
            description: '',
            isPublic: true,
            authors: [],
            categories: [],
            language: '',
            yearPublished: new Date().getFullYear(),
            publisher: null,
            copyrights: Copyrights.Unknown,
            seriesId: null,
            seriesIndex: null,
            source: null,
            status: BookStatus.AvailableForTyping
        },

        validate: {
            title: isNotEmpty(t("book.title.required")),
            authors: value => value.length < 1 ? (t("book.authors.required")) : null,
            language: isNotEmpty(t("book.language.required")),
            yearPublished: value => value ? isInRange({ min: 1000, max: new Date().getFullYear() }, t("book.yearPublished.error"))(value) : null,
        },
        onValuesChange: (values) => {
            form.validate();
            onValuesChange({ values, isValid: form.isValid() });
        }
    });

    useEffect(() => {
        if (!loaded && book != null) {
            form.initialize(book);
            setLoaded(true);
            if (validateOnLoad) {
                form.validate();
                onValuesChange({ values: book, isValid: form.isValid() });
            }
        }
    }, [book, form, loaded, onValuesChange, validateOnLoad]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <SimpleGrid cols={cols} >
                <TextInput key={form.key('title')}
                    label={t("book.title.label")}
                    placeholder={t("book.title.placeholder")}
                    {...form.getInputProps('title')}
                />

                <Textarea key={form.key('description')}
                    label={t("book.description.label")}
                    placeholder={t("book.description.placeholder")}
                    {...form.getInputProps('description')} />

                <Switch
                    label={t("book.public.label")}
                    key={form.key('isPublic')}
                    {...form.getInputProps('isPublic', { type: 'checkbox' })}
                />

                <AuthorsSelect t={t} libraryId={libraryId} showAdd
                    label={t("book.authors.label")}
                    placeholder={t("book.authors.placeholder")}
                    {...form.getInputProps('authors')} />

                <CategoriesSelect t={t}
                    libraryId={libraryId}
                    label={t("book.categories.label")}
                    placeholder={t("book.categories.placeholder")}
                    {...form.getInputProps('categories')} />
                <LanguageSelect
                    label={t("book.language.label")}
                    {...form.getInputProps('language')}
                />
                <CopyrightSelect t={t}
                    label={t("book.copyrights.label")}
                    {...form.getInputProps('copyrights')}
                />
                <NumberInput key={form.key('yearPublished')}
                    label={t("book.yearPublished.label")}
                    placeholder={t("book.yearPublished.placeholder")}
                    {...form.getInputProps('yearPublished')}
                />
                <PublisherAutocomplete key={form.key('publisher')}
                    libraryId={libraryId}
                    label={t("book.publisher.label")}
                    placeholder={t("book.publisher.placeholder")}
                    {...form.getInputProps('publisher')}
                />
                <Flex gap="md">
                    <SeriesSelect t={t} libraryId={libraryId}
                        label={t("book.series.label")}
                        placeholder={t("book.series.placeholder")}
                        {...form.getInputProps('seriesId')}
                        style={{ flex: 1 }}
                    />

                    <NumberInput key={form.key('seriesIndex')}
                        label={t("book.seriesIndex.label")}
                        {...form.getInputProps('seriesIndex')}
                        min={1}
                        max={1000}
                    />
                </Flex>

                <TextInput key={form.key('source')}
                    label={t("book.source.label")}
                    placeholder={t("book.source.placeholder")}
                    {...form.getInputProps('source')}
                />
                <PublishStatusSelect t={t}
                    label={t("book.status.label")}
                    {...form.getInputProps('status')}
                />
            </SimpleGrid>

            <If condition={showOk || showCancel}>
                <Group justify="flex-end" mt="md">
                    <If condition={showOk}>
                        <Button type="submit">{t('actions.save')}</Button>
                    </If>
                    <If condition={showCancel}>
                        <Button variant='light' onClick={onCancel}>{t('actions.cancel')}</Button>
                    </If>
                </Group>
            </If>
        </form>
    );
}

BookForm.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    onValuesChange: PropTypes.func,
    libraryId: PropTypes.any,
    cols: PropTypes.number,
    showCancel: PropTypes.bool,
    showOk: PropTypes.bool,
    validateOnLoad: PropTypes.bool,
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.array,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string
        })
    })
};

export default BookForm;
