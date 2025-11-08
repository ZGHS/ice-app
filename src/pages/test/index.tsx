import React, { useState } from 'react';
import { Button, Input } from 'antd';

const TestCom: React.FC = () => {
    const [responseData, setResponseData] = useState<string>('');
    const handleUpload = async () => {
        try {
            const response = await fetch('http://127.0.5.1:9000/api/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setResponseData(JSON.stringify(data, null, 2));
        } catch (error) {
            setResponseData(`请求失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
      <div style={{ padding: 20, maxWidth: 600 }}>
        <h1>Test Com</h1>
        <div style={{ marginBottom: 20 }}>
          <Button type="primary" onClick={handleUpload}>
            请求数据
          </Button>
        </div>
        <Input.TextArea
          value={responseData}
          placeholder="API返回的数据将显示在这里"
          rows={10}
          style={{ fontSize: 14 }}
        />
      </div>
    );
};

export default TestCom;