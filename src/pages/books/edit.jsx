import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from 'react-router-dom';

// 3rd party libraries

import { Button, Col, Form, Input, InputNumber, Row, App, Space, Spin, Switch } from "antd"
import { ImBooks } from "react-icons/im"

// Local imports
import { useGetBookQuery, useAddBookMutation, useUpdateBookMutation } from "../../features/api/booksSlice"
import ContentsContainer from "../../components/layout/contentContainer"
import PageHeader from "../../components/layout/pageHeader"
import Error from "../../components/common/error"
import Loading from "../../components/common/loader"
import AuthorsSelect from "../../components/author/authorsSelect"
import SeriesSelect from "../../components/series/seriesSelect"
import CategoriesSelect from "../../components/categories/categoriesSelect"
import LanguageSelect from "../../components/languageSelect"
import CopyrightSelect from "../../components/copyrightSelect"
import PublishStatusSelect from "../../components/publishStatusSelect"
// ----------------------------------------------

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } }
const buttonItemLayout =  { wrapperCol: { span: 14, offset: 4 } }

const BookEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { libraryId, bookId } = useParams()
    const [addBook, { isLoading: isAdding }] = useAddBookMutation()
    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation()
    const { data : book, error, isFetching } = useGetBookQuery({libraryId, bookId}, { skip : !libraryId || !bookId })

    if (isFetching) return <Loading />
    if (error) return (<Error />)

    const onSubmit = async (book) => {
        if (bookId) {
            try {
                const response = await updateBook({ libraryId, bookId, payload: book })
                    .unwrap()

                message.success(t('book.save.success'));
                navigate(`/libraries/${libraryId}/books/${response.id}`)
            }
            catch
            {
                message.error(t('book.save.error'));
            }
        } else {
            try {
                const response = await addBook({ libraryId, payload: book })
                .unwrap()
                message.success(t('book.save.success'));
                navigate(`/libraries/${libraryId}/books/${response.id}`)
            }
            catch
            {
                message.error(t('book.save.error'));
            }
        }
    };

    return (<>
        <PageHeader title={book.title} icon={<ImBooks style={{ width: 36, height: 36 }} />} />
        <ContentsContainer>
          <Row gutter={16}>
                <Col l={4} md={6} xs={24}>

                </Col>
                <Col l={20} md={18} xs={24}>
                    <Spin spinning={isFetching || isAdding || isUpdating}>
                        <Form name="login" onFinish={onSubmit}
                            {...formItemLayout}
                            layout="horizontal"
                            initialValues={book}>
                            <Form.Item name="title" label={t('book.title.label')}
                                rules={[
                                {
                                    required: true,
                                    message: t('book.title.required'),
                                }
                                ]}
                            >
                                <Input placeholder={t('book.title.placeholder')} />
                            </Form.Item>
                            <Form.Item name="description" label={t('book.description.label')}>
                                <Input.TextArea rows={4} />
                            </Form.Item>
                            <Form.Item name="isPublic" valuePropName="checked" label={t('book.public.label')}>
                                <Switch />
                            </Form.Item>
                            <Form.Item name="authors" label={t('book.authors.label')}>
                                <AuthorsSelect placeholder={t('book.authors.placeholder')}
                                    libraryId={libraryId}/>
                            </Form.Item>
                            <Form.Item name="categories" label={t('book.categories.label')}>
                                <CategoriesSelect libraryId={libraryId} placeholder={t('book.categories.placeholder')} />
                            </Form.Item>
                            <Form.Item name="language" label={t('book.language.label')}>
                                <LanguageSelect placeholder={t('book.language.placeholder')} />
                            </Form.Item>
                            <Form.Item name="yearPublished" label={t('book.yearPublished.label')}>
                                <InputNumber min={1} />
                            </Form.Item>
                            <Form.Item name="seriesId" label={t('book.series.label')}>
                                <SeriesSelect placeholder={t('book.series.placeholder')}
                                    libraryId={libraryId}/>
                            </Form.Item>
                            <Form.Item name="seriesIndex" label={t('book.seriesIndex.label')}>
                                <InputNumber min={1} />
                            </Form.Item>
                            <Form.Item name="copyrights" label={t('book.copyrights.label')}>
                                <CopyrightSelect t={t} />
                            </Form.Item>
                            <Form.Item name="status" label={t('book.status.label')} placeholder={t('book.status.placeholder')} >
                                <PublishStatusSelect t={t} />
                            </Form.Item>

                            <Form.Item {...buttonItemLayout}>
                                <Space direction="horizontal" size="middle" style={{ width: '100%' }}>
                                    <Button type="primary" htmlType="submit" size="large" block>{t('actions.save') }</Button>
                                    <Button type="secondary" size="large" block>{t('actions.cancel') }</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </ContentsContainer>
    </>)
}

export default BookEditPage
