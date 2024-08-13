package services

import (
	"context"
	"encoding/base64"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
	"strings"
	"sync"
)

type FileService struct {
	ctx context.Context
}

var file *FileService
var onceFile sync.Once

func File() *FileService {
	if file == nil {
		onceFile.Do(func() {
			file = &FileService{}
		})
	}
	return file
}

func (f *FileService) SaveBase64File(base64Data, fileName string) error {
	if idx := strings.Index(base64Data, "base64,"); idx != -1 {
		base64Data = base64Data[idx+len("base64,"):]
	}
	data, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		return fmt.Errorf("failed to decode base64 string: %w", err)
	}
	saveDialogOptions := runtime.SaveDialogOptions{
		DefaultFilename: fileName,
	}
	savePath, err := runtime.SaveFileDialog(f.ctx, saveDialogOptions)
	if err != nil {
		return err
	}
	return os.WriteFile(savePath, data, 0644)
}

func (f *FileService) Startup(ctx context.Context) {
	f.ctx = ctx
}
