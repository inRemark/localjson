package storage

import (
	"fmt"
	"gopkg.in/yaml.v3"
	"localjson/app/consts"
	"localjson/app/types"
	"log"
	"reflect"
	"strings"
	"sync"
)

type PreferencesStorage struct {
	storage *localStorage
	mutex   sync.Mutex
}

func NewPreferences() *PreferencesStorage {
	storage := NewLocalStore("preferences.yaml")
	log.Printf("preferences path: %s\n", storage.ConfPath)
	return &PreferencesStorage{
		storage: storage,
	}
}

func (p *PreferencesStorage) DefaultPreferences() types.Preferences {
	return types.NewPreferences()
}

func (p *PreferencesStorage) getPreferences() (ret types.Preferences) {
	ret = p.DefaultPreferences()
	b, err := p.storage.Load()
	if err != nil {
		return
	}

	if err = yaml.Unmarshal(b, &ret); err != nil {
		ret = p.DefaultPreferences()
		return
	}
	return
}

// GetPreferences Get preferences from local
func (p *PreferencesStorage) GetPreferences() (ret types.Preferences) {
	p.mutex.Lock()
	defer p.mutex.Unlock()

	ret = p.getPreferences()
	if ret.General.ScanSize <= 0 {
		ret.General.ScanSize = consts.DefaultScanSize
	}
	ret.Behavior.AsideWidth = max(ret.Behavior.AsideWidth, consts.DefaultAsideWidth)
	ret.Behavior.WindowWidth = max(ret.Behavior.WindowWidth, consts.MinWindowWidth)
	ret.Behavior.WindowHeight = max(ret.Behavior.WindowHeight, consts.MinWindowHeight)
	return
}

func (p *PreferencesStorage) setPreferences(pf *types.Preferences, key string, value any) error {
	parts := strings.Split(key, ".")
	if len(parts) > 0 {
		var reflectValue reflect.Value
		if reflect.TypeOf(pf).Kind() == reflect.Ptr {
			reflectValue = reflect.ValueOf(pf).Elem()
		} else {
			reflectValue = reflect.ValueOf(pf)
		}
		for i, part := range parts {
			part = strings.ToUpper(part[:1]) + part[1:]
			reflectValue = reflectValue.FieldByName(part)
			if reflectValue.IsValid() {
				if i == len(parts)-1 {
					reflectValue.Set(reflect.ValueOf(value))
					return nil
				}
			} else {
				break
			}
		}
	}

	return fmt.Errorf("invalid key path(%s)", key)
}

func (p *PreferencesStorage) savePreferences(pf *types.Preferences) error {
	b, err := yaml.Marshal(pf)
	if err != nil {
		return err
	}

	if err = p.storage.Store(b); err != nil {
		return err
	}
	return nil
}

// SetPreferences replace preferences
func (p *PreferencesStorage) SetPreferences(pf *types.Preferences) error {
	p.mutex.Lock()
	defer p.mutex.Unlock()

	return p.savePreferences(pf)
}

// UpdatePreferences update values by key paths, the key path use "." to indicate multiple level
func (p *PreferencesStorage) UpdatePreferences(values map[string]any) error {
	p.mutex.Lock()
	defer p.mutex.Unlock()

	pf := p.getPreferences()
	for path, v := range values {
		if err := p.setPreferences(&pf, path, v); err != nil {
			return err
		}
	}
	log.Println("after save", pf)

	return p.savePreferences(&pf)
}

func (p *PreferencesStorage) RestoreDefault() types.Preferences {
	p.mutex.Lock()
	defer p.mutex.Unlock()

	pf := p.DefaultPreferences()
	p.savePreferences(&pf)
	return pf
}
