import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FormValues } from "../types/fomValues";
import { useState } from "react";
import Papa from "papaparse";
import { ChartData } from "../types/chartData";
import { createFormValuesFromData } from "../utils/createFormValuesFromData";
import { getCityByCode } from "../utils/createDataFromMap";
import { RcFile } from "antd/es/upload";
import { DownloadCsvButton } from "./DownloadCsvButton";

type MapFormProps = {
  onSubmit: (formValues: FormValues) => void;
  data: ChartData;
};

interface CsvData {
  code?: string;
  ville?: string;
  value?: string;
}

export const MapForm = ({ onSubmit, data }: MapFormProps) => {
  const [form] = Form.useForm();

  const formValues = createFormValuesFromData(data);

  const onFinish = (values: FormValues) => {
    onSubmit(values);
    setIsModalOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const onCancel = () => setIsModalOpen(false);

  const handleFileChange = (file: RcFile) => {
    parseCsv(file);
    return false;
  };

  const parseCsv = (file: File) => {
    Papa.parse(file, {
      complete: (result: Papa.ParseResult<CsvData>) => {
        const { values, unknownCodes } = transformCsvToFormValues(result.data);
        form.setFieldsValue(values);
        if (unknownCodes.length > 0) {
          message.error(
            `Code(s) inconnu(s) dans le CSV: ${unknownCodes.join(", ")}`
          );
        }
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const transformCsvToFormValues = (csvData: CsvData[]) => {
    const transformedData: FormValues = {};
    const unknownCodes = new Set<string>();

    csvData.forEach((row) => {
      const code = row.code?.trim();
      const value = Number.parseInt(row.value ?? "", 10);

      if (!code || Number.isNaN(value)) {
        return;
      }

      const city = getCityByCode(code, data);
      if (!city) {
        unknownCodes.add(code);
        return;
      }

      transformedData[city] = value;
    });

    return { values: transformedData, unknownCodes: [...unknownCodes] };
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Saisir les données
      </Button>

      <Modal
        title={<div style={{ fontSize: "24px" }}>Formulaire</div>}
        open={isModalOpen}
        onCancel={onCancel}
        footer={null}
        width={"100%"}
      >
        <Form
          initialValues={formValues}
          form={form}
          name="mapForm"
          onFinish={onFinish}
        >
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name={"title"} label={"Titre du graphique"}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"label"} label={"Unité de mesure"}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Flex justify="space-between">
            <Space align="baseline">
              <Form.Item label="Fichier CSV">
                <Upload
                  beforeUpload={handleFileChange}
                  accept=".csv"
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>

            <DownloadCsvButton data={data} />
          </Flex>

          <Row gutter={[20, 10]}>
            {[...Object.entries(formValues)].map(([key, value], index) => (
              <Col span={24} sm={12} md={12} lg={6} xl={4} key={key + index}>
                <Form.Item name={key}>
                  <InputNumber
                    addonBefore={key}
                    style={{ width: "100%" }}
                    value={value}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </>
  );
};
