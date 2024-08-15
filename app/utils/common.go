package utils

import (
	"github.com/vrischmann/userdir"
	"os"
	"path"
)

func writeExecuteFile(content []byte, filename string) (string, error) {
	filepath := path.Join(userdir.GetConfigHome(), "LocalJson", "decoder", filename)
	_ = os.Mkdir(path.Dir(filepath), 0777)
	err := os.WriteFile(filepath, content, 0777)
	if err != nil {
		return "", err
	}
	return filepath, nil
}
